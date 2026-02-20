import Message from '../models/Message.model.js'
import Chat from '../models/Chat.model.js'
import User from '../models/User.model.js'
import logger from '../utils/logger.js'

export const registerChatSocket = (io, socket) => {
  const userId = socket.data.userId

  // ── JOIN CHAT ROOM ──────────────────────────────────────────
  socket.on('chat:join', async ({ chatId }) => {
    try {
      const chat = await Chat.findOne({ _id: chatId, 'members.user': userId })
      if (!chat) return socket.emit('error', { message: 'Access denied' })

      socket.join(`chat:${chatId}`)
      socket.emit('chat:joined', { chatId })
    } catch (err) {
      logger.error('chat:join error', err)
    }
  })

  socket.on('chat:leave', ({ chatId }) => {
    socket.leave(`chat:${chatId}`)
  })

  // ── SEND MESSAGE ─────────────────────────────────────────────
  socket.on('message:send', async ({ chatId, content, type = 'text', replyTo = null }) => {
    try {
      const chat = await Chat.findOne({ _id: chatId, 'members.user': userId })
      if (!chat) return socket.emit('error', { message: 'Chat not found' })

      const message = await Message.create({
        chat: chatId,
        sender: userId,
        content,
        type,
        replyTo,
      })

      await message.populate('sender', 'name avatar')
      if (replyTo) await message.populate({ path: 'replyTo', populate: { path: 'sender', select: 'name' } })

      // Update lastMessage on chat
      await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id })

      // Emit to everyone in the room (including sender)
      io.to(`chat:${chatId}`).emit('message:new', { message })

      // Notify offline members via their personal room
      chat.members.forEach(({ user }) => {
        if (user.toString() !== userId) {
          io.to(`user:${user}`).emit('notification:message', {
            chatId,
            message: { _id: message._id, content, sender: { _id: userId } },
          })
        }
      })
    } catch (err) {
      logger.error('message:send error', err)
      socket.emit('error', { message: 'Failed to send message' })
    }
  })

  // ── TYPING INDICATORS ────────────────────────────────────────
  socket.on('typing:start', ({ chatId }) => {
    socket.to(`chat:${chatId}`).emit('typing:start', { userId, chatId })
  })

  socket.on('typing:stop', ({ chatId }) => {
    socket.to(`chat:${chatId}`).emit('typing:stop', { userId, chatId })
  })

  // ── READ RECEIPTS ────────────────────────────────────────────
  socket.on('message:read', async ({ chatId, messageIds }) => {
    try {
      await Message.updateMany(
        { _id: { $in: messageIds }, 'readBy.user': { $ne: userId } },
        { $push: { readBy: { user: userId, readAt: new Date() } } }
      )
      socket.to(`chat:${chatId}`).emit('message:read', { userId, messageIds, chatId })
    } catch (err) {
      logger.error('message:read error', err)
    }
  })

  // ── REACTIONS ────────────────────────────────────────────────
  socket.on('message:react', async ({ messageId, chatId, emoji }) => {
    try {
      const message = await Message.findById(messageId)
      if (!message) return

      message.reactions = message.reactions.filter((r) => r.user.toString() !== userId)
      if (emoji) message.reactions.push({ user: userId, emoji })
      await message.save()

      io.to(`chat:${chatId}`).emit('message:reaction', {
        messageId,
        reactions: message.reactions,
      })
    } catch (err) {
      logger.error('message:react error', err)
    }
  })
}