import User from '../models/User.model.js'
import { sendSuccess, sendError } from '../utils/response.helper.js'
import { validate, registerSchema, loginSchema } from '../utils/validation.js'
import logger from '../utils/logger.js'

// ─── REGISTER ────────────────────────────────────────────────
export const register = async (request, reply) => {
  const { valid, errors, data } = validate(registerSchema, request.body)
  if (!valid) return sendError(reply, 'Validation failed', 422, errors)

  try {
    const exists = await User.findOne({ email: data.email })
    if (exists) return sendError(reply, 'Email already registered', 409)

    const user = await User.create(data)

    const token = reply.server.jwt.sign({
      id: user._id,
      email: user.email,
      name: user.name,
    })

    logger.info(`New user registered: ${user.email}`)

    return sendSuccess(
      reply,
      { user, token },
      'Account created successfully',
      201
    )
  } catch (err) {
    logger.error('Register error:', err)
    return sendError(reply, 'Registration failed', 500)
  }
}

// ─── LOGIN ───────────────────────────────────────────────────
export const login = async (request, reply) => {
  const { valid, errors, data } = validate(loginSchema, request.body)
  if (!valid) return sendError(reply, 'Validation failed', 422, errors)

  try {
    // We need password here, so explicitly select it
    const user = await User.findOne({ email: data.email }).select('+password')
    if (!user) return sendError(reply, 'Invalid email or password', 401)

    const passwordMatch = await user.comparePassword(data.password)
    if (!passwordMatch) return sendError(reply, 'Invalid email or password', 401)

    // Update status to online
    user.status = 'online'
    user.lastSeen = new Date()
    await user.save()

    const token = reply.server.jwt.sign({
      id: user._id,
      email: user.email,
      name: user.name,
    })

    logger.info(`User logged in: ${user.email}`)

    return sendSuccess(reply, { user, token }, 'Login successful')
  } catch (err) {
    logger.error('Login error:', err)
    return sendError(reply, 'Login failed', 500)
  }
}

// ─── GET CURRENT USER ────────────────────────────────────────
export const getMe = async (request, reply) => {
  try {
    const user = await User.findById(request.user.id)
    if (!user) return sendError(reply, 'User not found', 404)
    return sendSuccess(reply, { user }, 'User fetched successfully')
  } catch (err) {
    logger.error('GetMe error:', err)
    return sendError(reply, 'Failed to fetch user', 500)
  }
}

// ─── LOGOUT ──────────────────────────────────────────────────
export const logout = async (request, reply) => {
  try {
    await User.findByIdAndUpdate(request.user.id, {
      status: 'offline',
      lastSeen: new Date(),
    })
    return sendSuccess(reply, {}, 'Logged out successfully')
  } catch (err) {
    logger.error('Logout error:', err)
    return sendError(reply, 'Logout failed', 500)
  }
}