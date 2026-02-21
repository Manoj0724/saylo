import { getAllUsers, getMyProfile, updateProfile, updateStatus, searchUsers, getUserById, changePassword } from '../controllers/user.controller.js'

const userRoutes = async (fastify) => {
  const auth = { onRequest: [fastify.authenticate] }

  fastify.get('/',              { ...auth, schema: { tags: ['Users'], summary: 'Get all users' } },             getAllUsers)
  fastify.get('/me',            { ...auth, schema: { tags: ['Users'], summary: 'Get my profile' } },            getMyProfile)
  fastify.put('/me',            { ...auth, schema: { tags: ['Users'], summary: 'Update my profile' } },         updateProfile)
  fastify.patch('/me/status',   { ...auth, schema: { tags: ['Users'], summary: 'Update my status' } },          updateStatus)
  fastify.get('/search',        { ...auth, schema: { tags: ['Users'], summary: 'Search users' } },              searchUsers)
  fastify.get('/:userId',       { ...auth, schema: { tags: ['Users'], summary: 'Get user by ID' } },            getUserById)
  fastify.post('/me/change-password', { ...auth, schema: { tags: ['Users'], summary: 'Change password' } },    changePassword)
}

export default userRoutes