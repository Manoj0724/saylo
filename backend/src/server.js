import Fastify from 'fastify'
import cors from '@fastify/cors'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { connectDB } from './plugins/database.js'
import { registerRoutes } from './routes/index.js'
import { initSocketHandlers } from './sockets/index.js'
import logger from './utils/logger.js'

dotenv.config()

const fastify = Fastify({
  logger: false,
  trustProxy: true,
})

// ── CORS ──────────────────────────────────────────────────
await fastify.register(cors, {
  origin: [
    'http://localhost:4200',
    'https://manoj0724.github.io',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
})

// ── DATABASE ──────────────────────────────────────────────
await connectDB()

// ── ROUTES ────────────────────────────────────────────────
await registerRoutes(fastify)

// ── HEALTH CHECK ──────────────────────────────────────────
fastify.get('/api/health', async () => {
  return { status: 'ok', app: 'Saylo', timestamp: new Date().toISOString() }
})

fastify.get('/', async () => {
  return { status: 'ok', app: 'Saylo API', version: '1.0.0' }
})

// ── SOCKET.IO ─────────────────────────────────────────────
const io = new Server(fastify.server, {
  cors: {
    origin: [
      'http://localhost:4200',
      'https://manoj0724.github.io',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
  pingTimeout: 60000,
  pingInterval: 25000,
})

// Pass io to routes (for emitting from HTTP handlers if needed)
fastify.decorate('io', io)

// Initialize socket event handlers
initSocketHandlers(io)

// ── START SERVER ──────────────────────────────────────────
const PORT = process.env.PORT || 5001
const HOST = '0.0.0.0'  // IMPORTANT: must be 0.0.0.0 for Railway

try {
  await fastify.listen({ port: Number(PORT), host: HOST })
  logger.info(`🚀 Saylo server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV}`)
} catch (err) {
  logger.error('Server startup error:', err)
  process.exit(1)
}