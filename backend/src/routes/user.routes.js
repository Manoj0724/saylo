import { searchUsers, getUserProfile, updateProfile } from '../controllers/user.controller.js'

export const userRoutes = async (fastify) => {
  fastify.get('/', { preHandler: [fastify.authenticate], handler: searchUsers })
  fastify.get('/:id', { preHandler: [fastify.authenticate], handler: getUserProfile })
  fastify.patch('/me', { preHandler: [fastify.authenticate], handler: updateProfile })
}