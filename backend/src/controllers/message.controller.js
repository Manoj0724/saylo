import Message from '../models/Message.model.js'
import Chat from '../models/Chat.model.js'
import { successResponse, errorResponse } from '../utils/response.helper.js'
import logger from '../utils/logger.js'

// ── GET MESSAGES FOR A CHAT ───────────────────────────────────
const getMessages = async (request, reply) => {
  try {
    const userId = request.user.id
    const { chatId } = request.params
    const { page = 1, limit = 50 } = request.query

    // Make sure user is a participant in this chat
    const chat = await Chat.findOne({ _id: chatId, 'participants.user': userId })
    if (!chat) return errorResponse(reply, 'Chat not found or access denied', 404)

    const skip = (page - 1) * limit

    const messages = await Message.find({ chat: chatId, isDeleted: false })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Message.countDocuments({ chat: chatId, isDeleted: false })

    return successResponse(reply, messages, 'Messages fetched', 200)

  } catch (err) {
    logger.error('getMessages error:', err)
    return errorResponse(reply, 'Failed to get messages', 500)
  }
}

// ── SEND A MESSAGE ────────────────────────────────────────────
const sendMessage = async (request, reply) => {
  try {
    const userId = request.user.id
    const { chatId } = request.params
    const { content, type = 'text' } = request.body

    if (!content || content.trim().length === 0) {
      return errorResponse(reply, 'Message content is required', 400)
    }

    // Make sure user is a participant
    const chat = await Chat.findOne({ _id: chatId, 'participants.user': userId, isActive: true })
    if (!chat) return errorResponse(reply, 'Chat not found or access denied', 404)

    // Create the message
    const message = await Message.create({
      chat:    chatId,
      sender:  userId,
      content: content.trim(),
      type,
    })

    // Populate sender info before returning
    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar')

    // Update the chat's lastMessage and lastActivity
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage:  message._id,
      lastActivity: new Date(),
    })

    // Emit via socket so other users get it in real-time
    // (The socket server will broadcast to the chat room)
    const io = request.server.io
    if (io) {
      io.to(chatId).emit('message:received', populated)
    }

    logger.debug(`Message sent in chat ${chatId} by ${userId}`)
    return successResponse(reply, populated, 'Message sent', 201)

  } catch (err) {
    logger.error('sendMessage error:', err)
    return errorResponse(reply, 'Failed to send message', 500)
  }
}

// ── DELETE A MESSAGE ──────────────────────────────────────────
const deleteMessage = async (request, reply) => {
  try {
    const userId = request.user.id
    const { messageId } = request.params

    const message = await Message.findById(messageId)
    if (!message) return errorResponse(reply, 'Message not found', 404)

    // Only the sender can delete their message
    if (message.sender.toString() !== userId) {
      return errorResponse(reply, 'You can only delete your own messages', 403)
    }

    // Soft delete — we keep the record but mark it deleted
    message.isDeleted = true
    message.content   = 'This message was deleted'
    await message.save()

    // Notify others via socket
    const io = request.server.io
    if (io) {
      io.to(message.chat.toString()).emit('message:deleted', { messageId })
    }

    return successResponse(reply, null, 'Message deleted')

  } catch (err) {
    logger.error('deleteMessage error:', err)
    return errorResponse(reply, 'Failed to delete message', 500)
  }
}

// ── MARK MESSAGES AS READ ─────────────────────────────────────
const markAsRead = async (request, reply) => {
  try {
    const userId = request.user.id
    const { chatId } = request.params

    // Add user to readBy on all unread messages in this chat
    await Message.updateMany(
      {
        chat:    chatId,
        sender:  { $ne: userId },
        'readBy.user': { $ne: userId },
      },
      {
        $push: { readBy: { user: userId, readAt: new Date() } },
      }
    )

    return successResponse(reply, null, 'Marked as read')

  } catch (err) {
    logger.error('markAsRead error:', err)
    return errorResponse(reply, 'Failed to mark as read', 500)
  }
}

export { getMessages, sendMessage, deleteMessage, markAsRead }