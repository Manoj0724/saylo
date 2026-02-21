import { register, login, logout, refreshToken, getMe } from '../controllers/auth.controller.js'

const authRoutes = async (fastify) => {
  fastify.post('/register', {
    schema: {
      tags: ['Auth'], summary: 'Register new user',
      body: {
        type: 'object', required: ['name', 'email', 'password'],
        properties: {
          name:     { type: 'string', minLength: 2 },
          email:    { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          phone:    { type: 'string' },
        },
      },
    },
  }, register)

  fastify.post('/login', {
    schema: {
      tags: ['Auth'], summary: 'Login user',
      body: {
        type: 'object', required: ['email', 'password'],
        properties: {
          email:    { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
  }, login)

  fastify.post('/logout', {
    onRequest: [fastify.authenticate],
    schema: { tags: ['Auth'], summary: 'Logout user', security: [{ bearerAuth: [] }] },
  }, logout)

  fastify.post('/refresh', {
    schema: {
      tags: ['Auth'], summary: 'Refresh token',
      body: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } },
    },
  }, refreshToken)

  fastify.get('/me', {
    onRequest: [fastify.authenticate],
    schema: { tags: ['Auth'], summary: 'Get current user', security: [{ bearerAuth: [] }] },
  }, getMe)
}

export default authRoutes