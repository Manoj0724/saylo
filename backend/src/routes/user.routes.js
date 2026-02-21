import { 
  getAllUsers, 
  getMyProfile, 
  updateProfile, 
  updateStatus, 
  searchUsers, 
  getUserById, 
  changePassword 
} from '../controllers/user.controller.js'

const userRoutes = async (fastify) => {
  const auth = { onRequest: [fastify.authenticate] }

  fastify.get('/',                    { ...auth }, getAllUsers)
  fastify.get('/me',                  { ...auth }, getMyProfile)
  fastify.put('/me',                  { ...auth }, updateProfile)
  fastify.patch('/me/status',         { ...auth }, updateStatus)
  fastify.get('/search',              { ...auth }, searchUsers)
  fastify.get('/:userId',             { ...auth }, getUserById)
  fastify.post('/me/change-password', { ...auth }, changePassword)
}

export default userRoutes