import {
  getChats,
  createOrGetDirectChat,
  createGroupChat,
  deleteChat,
} from '../controllers/chat.controller.js'

const chatRoutes = async (fastify) => {
  const auth = { onRequest: [fastify.authenticate] }

  // GET /api/v1/chats — get all my chats
  fastify.get('/', {
    ...auth,
    schema: { tags: ['Chats'], summary: 'Get all my chats', security: [{ bearerAuth: [] }] },
  }, getChats)

  // POST /api/v1/chats/direct — create or get direct chat with a user
  fastify.post('/direct', {
    ...auth,
    schema: {
      tags: ['Chats'],
      summary: 'Create or get direct chat',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['targetUserId'],
        properties: { targetUserId: { type: 'string' } },
      },
    },
  }, createOrGetDirectChat)

  // POST /api/v1/chats/group — create a group chat
  fastify.post('/group', {
    ...auth,
    schema: {
      tags: ['Chats'],
      summary: 'Create group chat',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'participantIds'],
        properties: {
          name:           { type: 'string' },
          participantIds: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  }, createGroupChat)

  // DELETE /api/v1/chats/:chatId — leave or delete a chat
  fastify.delete('/:chatId', {
    ...auth,
    schema: { tags: ['Chats'], summary: 'Delete or leave chat', security: [{ bearerAuth: [] }] },
  }, deleteChat)
}

export default chatRoutes