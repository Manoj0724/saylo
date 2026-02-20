import Call from '../models/Call.model.js'
import Message from '../models/Message.model.js'
import User from '../models/User.model.js'
import logger from '../utils/logger.js'

export const registerCallSocket = (io, socket) => {
  const userId = socket.data.userId

  // ── INITIATE CALL ─────────────────────────────────────────
  socket.on('call:initiate', async ({ chatId, targetUserId, type }) => {
    try {
      logger.info(`[Call] Initiate: ${userId} → ${targetUserId} [${type}]`)

      // Check if target is connected
      const targetSockets = await io.in(`user:${targetUserId}`).fetchSockets()
      logger.info(`[Call] Target "${targetUserId}" has ${targetSockets.length} socket(s)`)

      if (targetSockets.length === 0) {
        logger.warn(`[Call] Target user ${targetUserId} offline`)
        socket.emit('call:user-offline', { targetUserId })
        return
      }

      // Create call record
      const call = await Call.create({
        chat: chatId,
        initiator: userId,
        type,
        status: 'ringing',
        participants: [
          { user: userId,       status: 'joined',  joinedAt: new Date() },
          { user: targetUserId, status: 'invited' },
        ],
      })

      const callId = call._id.toString()
      const caller = await User.findById(userId).select('name')

      socket.data.callId = callId
      socket.join(`call:${callId}`)

      // Confirm to caller
      socket.emit('call:initiated', { callId })
      logger.info(`[Call] Sent call:initiated to caller, callId=${callId}`)

      // Ring the target
      io.to(`user:${targetUserId}`).emit('call:incoming', {
        callId,
        from: userId,
        fromName: caller?.name || 'Someone',
        chatId,
        type,
      })
      logger.info(`[Call] Sent call:incoming to user:${targetUserId}`)

    } catch (err) {
      logger.error('[Call] Initiate error:', err)
      socket.emit('call:error', { message: 'Failed to initiate call' })
    }
  })

  // ── ANSWER CALL ───────────────────────────────────────────
  socket.on('call:answer', async ({ callId }) => {
    try {
      logger.info(`[Call] Answer: ${userId}, callId=${callId}`)

      await Call.findByIdAndUpdate(callId, {
        status: 'active',
        startedAt: new Date(),
      })

      socket.join(`call:${callId}`)
      io.to(`call:${callId}`).emit('call:answered', { callId, userId })
      logger.info(`[Call] Answered: callId=${callId}`)

    } catch (err) {
      logger.error('[Call] Answer error:', err)
    }
  })

  // ── DECLINE CALL ──────────────────────────────────────────
  socket.on('call:decline', async ({ callId }) => {
    try {
      logger.info(`[Call] Decline: ${userId}, callId=${callId}`)

      await Call.findByIdAndUpdate(callId, { status: 'declined' })

      // Save declined message
      const call = await Call.findById(callId)
      if (call) {
        const icon = call.type === 'video' ? '📹 Video' : '📞 Audio'
        const msg = await Message.create({
          chat: call.chat,
          sender: userId,
          type: 'system',
          content: `${icon} call · Declined`,
        })
        io.to(`chat:${call.chat}`).emit('message:new', { message: msg })
      }

      io.to(`call:${callId}`).emit('call:declined', { callId })
      socket.leave(`call:${callId}`)

    } catch (err) {
      logger.error('[Call] Decline error:', err)
    }
  })

  // ── END CALL ──────────────────────────────────────────────
  socket.on('call:end', async ({ callId }) => {
    try {
      logger.info(`[Call] End: ${userId}, callId=${callId}`)

      const call = await Call.findById(callId)
      if (!call) {
        logger.warn(`[Call] Not found: ${callId}`)
        return
      }

      const duration = call.startedAt
        ? Math.floor((Date.now() - new Date(call.startedAt).getTime()) / 1000)
        : 0

      await Call.findByIdAndUpdate(callId, {
        status: 'ended',
        endedAt: new Date(),
        duration,
      })

      const mins = Math.floor(duration / 60)
      const secs = duration % 60
      const durStr = duration > 0
        ? `${mins}:${String(secs).padStart(2, '0')}`
        : 'Not answered'

      const icon = call.type === 'video' ? '📹 Video' : '📞 Audio'

      const msg = await Message.create({
        chat: call.chat,
        sender: userId,
        type: 'system',
        content: `${icon} call · ${durStr}`,
      })

      io.to(`call:${callId}`).emit('call:ended', { callId, duration })
      io.to(`chat:${call.chat}`).emit('message:new', { message: msg })
      io.socketsLeave(`call:${callId}`)

      logger.info(`[Call] Ended: callId=${callId}, duration=${duration}s`)

    } catch (err) {
      logger.error('[Call] End error:', err)
    }
  })

  // ── WebRTC: OFFER ─────────────────────────────────────────
  socket.on('webrtc:offer', ({ callId, offer, targetUserId }) => {
    logger.info(`[WebRTC] Offer: ${userId} → ${targetUserId}`)
    io.to(`user:${targetUserId}`).emit('webrtc:offer', {
      callId,
      offer,
      from: userId,
    })
  })

  // ── WebRTC: ANSWER ────────────────────────────────────────
  socket.on('webrtc:answer', ({ callId, answer, targetUserId }) => {
    logger.info(`[WebRTC] Answer: ${userId} → ${targetUserId}`)
    io.to(`user:${targetUserId}`).emit('webrtc:answer', {
      callId,
      answer,
    })
  })

  // ── WebRTC: ICE CANDIDATE ─────────────────────────────────
  socket.on('webrtc:ice-candidate', ({ callId, candidate, targetUserId }) => {
    io.to(`user:${targetUserId}`).emit('webrtc:ice-candidate', {
      callId,
      candidate,
    })
  })
}