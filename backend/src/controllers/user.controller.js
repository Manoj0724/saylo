import User from '../models/User.model.js'
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.helper.js'
import logger from '../utils/logger.js'

const getAllUsers = async (request, reply) => {
  try {
    const { page = 1, limit = 20 } = request.query
    const skip  = (page - 1) * limit
    const total = await User.countDocuments({ _id: { $ne: request.user.id }, isActive: true })
    const users = await User.find({ _id: { $ne: request.user.id }, isActive: true })
      .select('name email avatar status lastSeen bio').sort({ name: 1 }).skip(skip).limit(parseInt(limit))
    return paginatedResponse(reply, users, { page: parseInt(page), limit: parseInt(limit), total })
  } catch (err) { return errorResponse(reply, 'Failed to fetch users', 500) }
}

const getMyProfile = async (request, reply) => {
  try {
    const user = await User.findById(request.user.id)
    if (!user) return errorResponse(reply, 'User not found', 404)
    return successResponse(reply, { user: user.toPublicProfile() })
  } catch (err) { return errorResponse(reply, 'Failed to get profile', 500) }
}

const updateProfile = async (request, reply) => {
  try {
    const { name, bio, phone, avatar, settings } = request.body
    const updates = {}
    if (name)                 updates.name     = name
    if (bio  !== undefined)   updates.bio      = bio
    if (phone)                updates.phone    = phone
    if (avatar)               updates.avatar   = avatar
    if (settings)             updates.settings = settings

    const user = await User.findByIdAndUpdate(request.user.id, { $set: updates }, { new: true, runValidators: true })
    if (!user) return errorResponse(reply, 'User not found', 404)
    return successResponse(reply, { user: user.toPublicProfile() }, 'Profile updated')
  } catch (err) { return errorResponse(reply, 'Failed to update profile', 500) }
}

const updateStatus = async (request, reply) => {
  try {
    const { status } = request.body
    const valid = ['online', 'offline', 'away', 'busy', 'do-not-disturb']
    if (!valid.includes(status)) return errorResponse(reply, `Status must be one of: ${valid.join(', ')}`, 400)
    const user = await User.findByIdAndUpdate(request.user.id, { status, lastSeen: new Date() }, { new: true })
    return successResponse(reply, { status: user.status }, 'Status updated')
  } catch (err) { return errorResponse(reply, 'Failed to update status', 500) }
}

const searchUsers = async (request, reply) => {
  try {
    const { q, limit = 10 } = request.query
    if (!q || q.trim().length < 1) return errorResponse(reply, 'Search query required', 400)
    const users = await User.find({
      _id: { $ne: request.user.id }, isActive: true,
      $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }],
    }).select('name email avatar status').limit(parseInt(limit))
    return successResponse(reply, { users, count: users.length })
  } catch (err) { return errorResponse(reply, 'Search failed', 500) }
}

const getUserById = async (request, reply) => {
  try {
    const user = await User.findById(request.params.userId).select('name email avatar bio status lastSeen')
    if (!user) return errorResponse(reply, 'User not found', 404)
    return successResponse(reply, { user })
  } catch (err) { return errorResponse(reply, 'Failed to get user', 500) }
}

const changePassword = async (request, reply) => {
  try {
    const { currentPassword, newPassword } = request.body
    const user = await User.findById(request.user.id).select('+password')
    if (!user) return errorResponse(reply, 'User not found', 404)
    const isValid = await user.comparePassword(currentPassword)
    if (!isValid) return errorResponse(reply, 'Current password is incorrect', 401)
    user.password = newPassword
    await user.save()
    return successResponse(reply, null, 'Password changed successfully')
  } catch (err) { return errorResponse(reply, 'Failed to change password', 500) }
}

export { getAllUsers, getMyProfile, updateProfile, updateStatus, searchUsers, getUserById, changePassword }