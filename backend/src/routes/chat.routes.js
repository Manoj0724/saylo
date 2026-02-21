import {
  getChats,
  createOrGetDirectChat,
  createGroupChat,
  deleteChat,
} from '../controllers/chat.controller.js'

const chatRoutes = async (fastify) => {
  const auth = { onRequest: [fastify.authenticate] }

  fastify.get('/', { ...auth }, getChats)
  fastify.post('/direct', { ...auth }, createOrGetDirectChat)
  fastify.post('/group', { ...auth }, createGroupChat)
  fastify.delete('/:chatId', { ...auth }, deleteChat)
}

export default chatRoutes