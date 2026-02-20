import Message from '../models/Message.model.js'
import Chat from '../models/Chat.model.js'
import { sendSuccess, sendError } from '../utils/response.helper.js'
import logger from '../utils/logger.js'

export const getMessages = async (request, reply) => {
  try {
    const { chatId } = request.params
    const { page = 1, limit = 50 } = request.query
    const skip = (page - 1) * limit

    const chat = await Chat.findOne({ _id: chatId, 'members.user': request.user.id })
    if (!chat) return sendError(reply, 'Chat not found or access denied', 404)

    const [messages, total] = await Promise.all([
      Message.find({ chat: chatId, isDeleted: false })
        .populate('sender', 'name avatar')
        .populate({ path: 'replyTo', populate: { path: 'sender', select: 'name' } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Message.countDocuments({ chat: chatId, isDeleted: false }),
    ])

    return sendSuccess(reply, {
      messages: messages.reverse(),
      total,
      page: Number(page),
      hasMore: skip + messages.length < total,
    })
  } catch (err) {
    logger.error('GetMessages error:', err)
    return sendError(reply, 'Failed to fetch messages', 500)
  }
}

export const deleteMessage = async (request, reply) => {
  try {
    const message = await Message.findOne({
      _id: request.params.id,
      sender: request.user.id,
    })
    if (!message) return sendError(reply, 'Message not found or not yours', 404)

    message.isDeleted = true
    message.deletedAt = new Date()
    message.content = ''
    await message.save()

    return sendSuccess(reply, { messageId: message._id }, 'Message deleted')
  } catch (err) {
    logger.error('DeleteMessage error:', err)
    return sendError(reply, 'Failed to delete message', 500)
  }
}

export const reactToMessage = async (request, reply) => {
  try {
    const { emoji } = request.body
    const message = await Message.findById(request.params.id)
    if (!message) return sendError(reply, 'Message not found', 404)

    message.reactions = message.reactions.filter(
      (r) => r.user.toString() !== request.user.id
    )
    if (emoji) message.reactions.push({ user: request.user.id, emoji })
    await message.save()

    return sendSuccess(reply, { reactions: message.reactions }, 'Reaction updated')
  } catch (err) {
    logger.error('ReactToMessage error:', err)
    return sendError(reply, 'Failed to react', 500)
  }
}