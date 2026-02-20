import { searchUsers, getUserProfile, updateProfile } from '../controllers/user.controller.js'

const auth = async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch {
    reply.code(401).send({ error: 'Unauthorized' })
  }
}

export const userRoutes = async (fastify) => {
  fastify.get('/',    { preHandler: auth, handler: searchUsers })
  fastify.get('/:id', { preHandler: auth, handler: getUserProfile })
  fastify.patch('/me',{ preHandler: auth, handler: updateProfile })
}