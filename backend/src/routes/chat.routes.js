import {
  createOrGetPrivateChat,
  createGroupChat,
  getMyChats,
  getChatById,
} from '../controllers/chat.controller.js'

const auth = async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch {
    reply.code(401).send({ error: 'Unauthorized' })
  }
}

export const chatRoutes = async (fastify) => {
  fastify.get('/',       { preHandler: auth, handler: getMyChats })
  fastify.get('/:id',    { preHandler: auth, handler: getChatById })
  fastify.post('/',      { preHandler: auth, handler: createOrGetPrivateChat })
  fastify.post('/group', { preHandler: auth, handler: createGroupChat })
}