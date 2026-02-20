import { sendSuccess, sendError } from '../utils/response.helper.js'
import Call from '../models/Call.model.js'

export const callRoutes = async (fastify) => {
  // GET call history for a chat
  fastify.get('/:chatId', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const calls = await Call.find({ chat: request.params.chatId })
          .populate('initiator', 'name avatar')
          .populate('participants.user', 'name avatar')
          .sort({ createdAt: -1 })
          .limit(20)
        return sendSuccess(reply, { calls })
      } catch {
        return sendError(reply, 'Failed to fetch calls', 500)
      }
    },
  })
}