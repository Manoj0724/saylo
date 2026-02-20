import User from '../models/User.model.js'
import { sendSuccess, sendError } from '../utils/response.helper.js'
import logger from '../utils/logger.js'

// GET /api/users — search users by name or email
export const searchUsers = async (request, reply) => {
  try {
    const { q = '', page = 1, limit = 20 } = request.query
    const skip = (page - 1) * limit

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
          ],
          _id: { $ne: request.user.id }, // exclude self
        }
      : { _id: { $ne: request.user.id } }

    const [users, total] = await Promise.all([
      User.find(filter).select('name email avatar status lastSeen').skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ])

    return sendSuccess(reply, { users, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    logger.error('SearchUsers error:', err)
    return sendError(reply, 'Failed to search users', 500)
  }
}

// GET /api/users/:id — get user profile
export const getUserProfile = async (request, reply) => {
  try {
    const user = await User.findById(request.params.id).select('name email avatar status lastSeen bio')
    if (!user) return sendError(reply, 'User not found', 404)
    return sendSuccess(reply, { user })
  } catch (err) {
    logger.error('GetUserProfile error:', err)
    return sendError(reply, 'Failed to fetch user', 500)
  }
}

// PATCH /api/users/me — update own profile
export const updateProfile = async (request, reply) => {
  try {
    const allowed = ['name', 'bio', 'avatar']
    const updates = {}
    allowed.forEach((field) => {
      if (request.body[field] !== undefined) updates[field] = request.body[field]
    })

    const user = await User.findByIdAndUpdate(request.user.id, updates, {
      new: true,
      runValidators: true,
    })

    return sendSuccess(reply, { user }, 'Profile updated')
  } catch (err) {
    logger.error('UpdateProfile error:', err)
    return sendError(reply, 'Failed to update profile', 500)
  }
}