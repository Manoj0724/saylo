import User from '../models/User.model.js'
import { registerChatSocket } from './chat.socket.js'
import { registerCallSocket } from './call.socket.js'
import logger from '../utils/logger.js'

export const initSocketHandlers = (io) => {
  io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId

    if (!userId || userId === 'undefined' || userId === 'null') {
      logger.warn('[Socket] Connection rejected — no userId')
      socket.disconnect()
      return
    }

    socket.data.userId = userId

    // CRITICAL: join personal room immediately so calls/messages reach this user
    await socket.join(`user:${userId}`)
    
    const rooms = Array.from(socket.rooms)
    logger.info(`[Socket] ✅ Connected: userId=${userId} socketId=${socket.id}`)
    logger.info(`[Socket] Rooms: ${rooms.join(', ')}`)

    // Verify join worked
    const roomMembers = await io.in(`user:${userId}`).fetchSockets()
    logger.info(`[Socket] user:${userId} now has ${roomMembers.length} socket(s)`)

    try {
      await User.findByIdAndUpdate(userId, { status: 'online', lastSeen: new Date() })
      socket.broadcast.emit('user:online', { userId })
    } catch (err) {
      logger.error('[Socket] DB error on connect:', err)
    }

    registerChatSocket(io, socket)
    registerCallSocket(io, socket)

    socket.on('disconnect', async (reason) => {
      logger.info(`[Socket] Disconnected: userId=${userId} reason=${reason}`)
      try {
        await User.findByIdAndUpdate(userId, { status: 'offline', lastSeen: new Date() })
        socket.broadcast.emit('user:offline', { userId })
      } catch (err) {
        logger.error('[Socket] DB error on disconnect:', err)
      }
    })
  })

  io.engine.on('connection_error', (err) => {
    logger.error('[Socket] Engine error:', err.code, err.message)
  })
}