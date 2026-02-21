import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { connectDB } from './plugins/database.js'
import { registerRoutes } from './routes/index.js'
import { initSocketHandlers } from './sockets/index.js'

dotenv.config()

const fastify = Fastify({ logger: true, trustProxy: true })

// ── CORS — allow ALL origins ─────────────────────────────
await fastify.register(cors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// ── JWT ──────────────────────────────────────────────────
await fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'saylo_default_secret_change_in_production',
})

// ── AUTHENTICATE DECORATOR ───────────────────────────────
fastify.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' })
  }
})

// ── HEALTH CHECK ─────────────────────────────────────────
fastify.get('/', async () => ({ status: 'ok', app: 'Saylo API' }))
fastify.get('/api/health', async () => ({ status: 'ok', app: 'Saylo', timestamp: new Date().toISOString() }))

// ── MONGODB ──────────────────────────────────────────────
await connectDB()

// ── ROUTES ───────────────────────────────────────────────
await registerRoutes(fastify)

// ── SOCKET.IO ────────────────────────────────────────────
const io = new Server(fastify.server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['polling', 'websocket'],
  pingTimeout: 60000,
  pingInterval: 25000,
})

fastify.decorate('io', io)
initSocketHandlers(io)

// ── START ─────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '5001')
try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' })
  console.log(`🚀 Saylo running on port ${PORT}`)
} catch (err) {
  console.error('❌ Server failed:', err)
  process.exit(1)
}