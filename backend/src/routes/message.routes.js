import { getMessages, deleteMessage, reactToMessage } from '../controllers/message.controller.js'

export const messageRoutes = async (fastify) => {
  fastify.get('/:chatId', { preHandler: [fastify.authenticate], handler: getMessages })
  fastify.delete('/:id', { preHandler: [fastify.authenticate], handler: deleteMessage })
  fastify.post('/:id/react', { preHandler: [fastify.authenticate], handler: reactToMessage })
}