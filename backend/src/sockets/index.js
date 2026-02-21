import { handleChatSocket } from './chat.socket.js'
import { handleCallSocket } from './call.socket.js'
import logger from '../utils/logger.js'

const onlineUsers = new Map()

const initSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    logger.info(`🔌 Connected: ${socket.id}`)

    socket.on('user:online', (userId) => {
      onlineUsers.set(userId, socket.id)
      socket.userId = userId
      io.emit('users:online-list', Array.from(onlineUsers.keys()))
      logger.info(`👤 Online: ${userId}`)
    })

    handleChatSocket(socket, io, onlineUsers)
    handleCallSocket(socket, io, onlineUsers)

    socket.on('typing:start', ({ chatId, userId, userName }) => {
      socket.to(chatId).emit('typing:started', { userId, userName })
    })

    socket.on('typing:stop', ({ chatId, userId }) => {
      socket.to(chatId).emit('typing:stopped', { userId })
    })

    socket.on('disconnect', (reason) => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId)
        io.emit('users:online-list', Array.from(onlineUsers.keys()))
        logger.info(`👤 Offline: ${socket.userId} (${reason})`)
      }
    })

    socket.on('error', (error) => logger.error(`Socket error ${socket.id}:`, error))
  })
}

export { initSocketHandlers, onlineUsers }