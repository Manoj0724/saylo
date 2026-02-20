import { register, login, getMe, logout } from '../controllers/auth.controller.js'

const auth = async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch {
    reply.code(401).send({ error: 'Unauthorized' })
  }
}

export const authRoutes = async (fastify) => {
  fastify.post('/register', { handler: register })
  fastify.post('/login', { handler: login })
  fastify.get('/me', { preHandler: auth, handler: getMe })
  fastify.post('/logout', { preHandler: auth, handler: logout })
}