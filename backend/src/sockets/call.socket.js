import logger from '../utils/logger.js'

const handleCallSocket = (socket, io, onlineUsers) => {
  socket.on('call:initiate', ({ targetUserId, callerId, callerName, callType }) => {
    const targetSocketId = onlineUsers.get(targetUserId)
    if (!targetSocketId) { socket.emit('call:user-offline', { targetUserId }); return }
    io.to(targetSocketId).emit('call:incoming', { callerId, callerName, callType, socketId: socket.id })
    logger.debug(`Call: ${callerId} → ${targetUserId} (${callType})`)
  })

  socket.on('call:accept',  ({ callerSocketId, calleeId }) => io.to(callerSocketId).emit('call:accepted', { calleeId, calleeSocketId: socket.id }))
  socket.on('call:reject',  ({ callerSocketId, reason })  => io.to(callerSocketId).emit('call:rejected', { reason }))
  socket.on('call:end',     ({ targetSocketId })           => io.to(targetSocketId).emit('call:ended'))

  socket.on('webrtc:offer',          ({ targetSocketId, sdp })       => io.to(targetSocketId).emit('webrtc:offer',          { sdp, fromSocketId: socket.id }))
  socket.on('webrtc:answer',         ({ targetSocketId, sdp })       => io.to(targetSocketId).emit('webrtc:answer',         { sdp, fromSocketId: socket.id }))
  socket.on('webrtc:ice-candidate',  ({ targetSocketId, candidate }) => io.to(targetSocketId).emit('webrtc:ice-candidate',  { candidate, fromSocketId: socket.id }))
}

export { handleCallSocket }