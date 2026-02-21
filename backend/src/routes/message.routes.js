import {
  getMessages,
  sendMessage,
  deleteMessage,
  markAsRead,
} from '../controllers/message.controller.js'

const messageRoutes = async (fastify) => {
  const auth = { onRequest: [fastify.authenticate] }

  // GET /api/v1/messages/:chatId — get all messages in a chat
  fastify.get('/:chatId', {
    ...auth,
    schema: { tags: ['Messages'], summary: 'Get messages in chat', security: [{ bearerAuth: [] }] },
  }, getMessages)

  // POST /api/v1/messages/:chatId — send a message in a chat
  fastify.post('/:chatId', {
    ...auth,
    schema: {
      tags: ['Messages'],
      summary: 'Send a message',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['content'],
        properties: {
          content: { type: 'string', minLength: 1 },
          type:    { type: 'string', enum: ['text', 'image', 'file'], default: 'text' },
        },
      },
    },
  }, sendMessage)

  // DELETE /api/v1/messages/:messageId — delete a message
  fastify.delete('/:messageId', {
    ...auth,
    schema: { tags: ['Messages'], summary: 'Delete a message', security: [{ bearerAuth: [] }] },
  }, deleteMessage)

  // POST /api/v1/messages/:chatId/read — mark all messages as read
  fastify.post('/:chatId/read', {
    ...auth,
    schema: { tags: ['Messages'], summary: 'Mark messages as read', security: [{ bearerAuth: [] }] },
  }, markAsRead)
}

export default messageRoutes