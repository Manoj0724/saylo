import {
  createOrGetPrivateChat,
  createGroupChat,
  getMyChats,
  getChatById,
} from '../controllers/chat.controller.js'

export const chatRoutes = async (fastify) => {
  fastify.get('/', { preHandler: [fastify.authenticate], handler: getMyChats })
  fastify.get('/:id', { preHandler: [fastify.authenticate], handler: getChatById })
  fastify.post('/', { preHandler: [fastify.authenticate], handler: createOrGetPrivateChat })
  fastify.post('/group', { preHandler: [fastify.authenticate], handler: createGroupChat })
}