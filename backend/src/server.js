// ═══════════════════════════════════════════════════════
// SAYLO SERVER — SDD Implementation
// SPEC:
//   - Start Fastify server on PORT from environment
//   - Register CORS for GitHub Pages + localhost
//   - Connect to MongoDB before starting
//   - Register all API routes under /api
//   - Initialize Socket.io for real-time features
//   - Listen on 0.0.0.0 (required for Railway)
// ═══════════════════════════════════════════════════════

import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { connectDB } from './plugins/database.js'
import { registerRoutes } from './routes/index.js'
import { initSocketHandlers } from './sockets/index.js'

dotenv.config()

// ── 1. CREATE FASTIFY INSTANCE ──────────────────────────
const fastify = Fastify({
  logger: true,
  trustProxy: true,
})

// ── 2. REGISTER CORS ────────────────────────────────────
await fastify.register(cors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
})

// ── 3. REGISTER JWT ─────────────────────────────────────
await fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'saylo_default_secret_change_in_production',
})

// ── 4. ADD JWT DECORATOR ─────────────────────────────────
fastify.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or missing token' })
  }
})

// ── 5. HEALTH CHECK ─────────────────────────────────────
fastify.get('/', async () => ({
  status: 'ok',
  app: 'Saylo API',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
}))

fastify.get('/api/health', async () => ({
  status: 'ok',
  app: 'Saylo',
  timestamp: new Date().toISOString(),
}))

// ── 6. CONNECT TO MONGODB ────────────────────────────────
await connectDB()

// ── 7. REGISTER API ROUTES ───────────────────────────────
await registerRoutes(fastify)

// ── 8. SETUP SOCKET.IO ───────────────────────────────────
const io = new Server(fastify.server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
  pingTimeout: 60000,
  pingInterval: 25000,
})

fastify.decorate('io', io)
initSocketHandlers(io)

// ── 9. START SERVER ─────────────────────────────────────
const PORT = parseInt(process.env.PORT || '5001')
const HOST = '0.0.0.0'

try {
  await fastify.listen({ port: PORT, host: HOST })
  console.log(`🚀 Saylo server running on http://${HOST}:${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
} catch (err) {
  console.error('❌ Server failed to start:', err)
  process.exit(1)
}