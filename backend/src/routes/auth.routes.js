import { register, login, getMe, logout } from '../controllers/auth.controller.js'

export const authRoutes = async (fastify) => {
  fastify.post('/register', { handler: register })
  fastify.post('/login',    { handler: login })
  fastify.get('/me',        { preHandler: [fastify.authenticate], handler: getMe })
  fastify.post('/logout',   { preHandler: [fastify.authenticate], handler: logout })
}