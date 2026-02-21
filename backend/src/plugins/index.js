import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import multipart from '@fastify/multipart'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

const registerPlugins = async (fastify) => {
  await fastify.register(cors, {
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, Railway health checks, etc.)
      if (!origin) {
        callback(null, true)
        return
      }
      // List of allowed origins
      const allowed = [
        'https://manoj0724.github.io', // Your GitHub Pages frontend
        'http://localhost:4200',        // Local development
        'http://localhost:3000',        // Local development alternative
      ]
      if (allowed.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`), false)
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  await fastify.register(helmet, { contentSecurityPolicy: false })

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: 60000,
  })

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  })

  await fastify.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } })

  await fastify.register(swagger, {
    openapi: {
      info: { title: 'Saylo API', description: 'Saylo Backend API', version: '1.0.0' },
      components: {
        securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      },
      tags: [
        { name: 'Auth', description: 'Authentication' },
        { name: 'Users', description: 'User management' },
        { name: 'Chats', description: 'Chat management' },
        { name: 'Messages', description: 'Messages' },
        { name: 'Calls', description: 'Calls' },
      ],
    },
  })

  await fastify.register(swaggerUI, { routePrefix: '/documentation' })

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.code(401).send({ success: false, message: 'Invalid or expired token' })
    }
  })
}

export { registerPlugins }