import { chatSocketHandlers } from './chat.socket.js'
import { callSocketHandlers } from './call.socket.js'

// Track online users: userId -> Set of socketIds
const onlineUsers = new Map()

export const initSocketHandlers = (io) => {

  io.on('connection', async (socket) => {
    const userId = socket.handshake.auth?.userId

    if (!userId) {
      console.log('[Socket] No userId — disconnecting')
      socket.disconnect()
      return
    }

    console.log(`[Socket] ✅ Connected: userId=${userId} socketId=${socket.id}`)

    // ── JOIN USER ROOM ──────────────────────────────────────
    await socket.join(`user:${userId}`)

    // ── TRACK ONLINE STATUS ────────────────────────────────
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set())
    }
    onlineUsers.get(userId).add(socket.id)

    console.log(`[Socket] Online users: ${onlineUsers.size}`)

    // ── BROADCAST USER IS ONLINE ───────────────────────────
    // Tell ALL other connected users this person is online
    socket.broadcast.emit('user:online', { userId })

    // ── SEND CURRENT ONLINE USERS TO THIS NEW CONNECTION ──
    const onlineUserIds = Array.from(onlineUsers.keys()).filter(id => id !== userId)
    socket.emit('users:online-list', { userIds: onlineUserIds })

    // ── REGISTER CHAT AND CALL HANDLERS ───────────────────
    chatSocketHandlers(io, socket, userId)
    callSocketHandlers(io, socket, userId)

    // ── HANDLE DISCONNECT ──────────────────────────────────
    socket.on('disconnect', async (reason) => {
      console.log(`[Socket] Disconnected: userId=${userId} reason=${reason}`)

      // Remove this socket from user's set
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id)

        // Only mark offline if user has NO more active sockets
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId)
          console.log(`[Socket] 🔴 User offline: ${userId}`)

          // Tell ALL other users this person went offline
          socket.broadcast.emit('user:offline', { userId })
        }
      }
    })

    // ── PING / PONG for connection health ─────────────────
    socket.on('ping', () => socket.emit('pong'))
  })
}

// Helper to check if user is online (used by call handlers)
export const isUserOnline = (userId) => onlineUsers.has(userId) && onlineUsers.get(userId).size > 0

// Helper to get all online user IDs
export const getOnlineUsers = () => Array.from(onlineUsers.keys())