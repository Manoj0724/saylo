import Fastify from 'fastify'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { connectDB } from './plugins/database.js'
import { registerPlugins } from './plugins/index.js'
import { registerRoutes } from './routes/index.js'
import { initSocketHandlers } from './sockets/index.js'
import logger from './utils/logger.js'

dotenv.config()

const fastify = Fastify({ logger: false, trustProxy: true })

const bootstrap = async () => {
  try {
    await connectDB()
    logger.info('✅ MongoDB connected')

    await registerPlugins(fastify)
    logger.info('✅ Plugins registered')

    await registerRoutes(fastify)
    logger.info('✅ Routes registered')

    const PORT = parseInt(process.env.PORT) || 5001

    await fastify.listen({ port: PORT, host: '0.0.0.0' })
    logger.info(`🚀 Saylo running on http://localhost:${PORT}`)

    // Attach Socket.io AFTER listen — to the same underlying http server
    const io = new Server(fastify.server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
    })

    initSocketHandlers(io)
    logger.info('✅ Sockets initialized')
    logger.info(`📚 Docs: http://localhost:${PORT}/documentation`)

  } catch (err) {
    logger.error('❌ Startup failed:', err)
    process.exit(1)
  }
}

process.on('SIGINT',  async () => { await fastify.close(); process.exit(0) })
process.on('SIGTERM', async () => { await fastify.close(); process.exit(0) })

bootstrap()

export { fastify }