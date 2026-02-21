import logger from '../utils/logger.js'

const handleChatSocket = (socket, io, onlineUsers) => {
  socket.on('chat:join',  (chatId) => { socket.join(chatId);  logger.debug(`Joined chat: ${chatId}`) })
  socket.on('chat:leave', (chatId) => { socket.leave(chatId); logger.debug(`Left chat: ${chatId}`) })

  socket.on('message:send', async ({ chatId, message }) => {
    try {
      io.to(chatId).emit('message:received', { ...message, timestamp: new Date().toISOString() })
    } catch (err) {
      socket.emit('message:error', { error: 'Failed to send message', chatId })
    }
  })

  socket.on('message:read', ({ chatId, messageId, userId }) => {
    socket.to(chatId).emit('message:read-receipt', { messageId, userId, readAt: new Date().toISOString() })
  })

  socket.on('message:react', ({ chatId, messageId, userId, reaction }) => {
    io.to(chatId).emit('message:reacted', { messageId, userId, reaction })
  })
}

export { handleChatSocket }