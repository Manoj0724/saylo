import { register, login, getMe, logout } from '../controllers/auth.controller.js'

export const authRoutes = async (fastify) => {
  // POST /api/auth/register
  fastify.post('/register', {
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
    handler: register,
  })

  // POST /api/auth/login
  fastify.post('/login', {
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
    handler: login,
  })

  // GET /api/auth/me  — protected
  fastify.get('/me', {
    preHandler: [fastify.authenticate],
    handler: getMe,
  })

  // POST /api/auth/logout  — protected
  fastify.post('/logout', {
    preHandler: [fastify.authenticate],
    handler: logout,
  })
}