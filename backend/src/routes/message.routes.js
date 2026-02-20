import { getMessages, deleteMessage, reactToMessage } from '../controllers/message.controller.js'

const auth = async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch {
    reply.code(401).send({ error: 'Unauthorized' })
  }
}

export const messageRoutes = async (fastify) => {
  fastify.get('/:chatId',    { preHandler: auth, handler: getMessages })
  fastify.delete('/:id',     { preHandler: auth, handler: deleteMessage })
  fastify.post('/:id/react', { preHandler: auth, handler: reactToMessage })
}