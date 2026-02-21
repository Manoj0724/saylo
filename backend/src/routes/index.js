import authRoutes    from './auth.routes.js'
import userRoutes    from './user.routes.js'
import chatRoutes    from './chat.routes.js'
import messageRoutes from './message.routes.js'
import callRoutes    from './call.routes.js'

export const registerRoutes = async (fastify) => {
  fastify.register(authRoutes,    { prefix: '/api/auth' })
  fastify.register(userRoutes,    { prefix: '/api/users' })
  fastify.register(chatRoutes,    { prefix: '/api/chats' })
  fastify.register(messageRoutes, { prefix: '/api/messages' })
  fastify.register(callRoutes,    { prefix: '/api/calls' })
}