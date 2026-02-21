import User from '../models/User.model.js'
import { successResponse, errorResponse } from '../utils/response.helper.js'
import logger from '../utils/logger.js'

// ── REGISTER ──────────────────────────────────────────────────
const register = async (request, reply) => {
  try {
    const { name, email, password, phone } = request.body

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return errorResponse(reply, 'Email already registered', 409)

    const user = await User.create({ name, email, password, phone })

    const accessToken  = request.server.jwt.sign({ id: user._id, email: user.email, name: user.name })
    const refreshToken = request.server.jwt.sign({ id: user._id }, { expiresIn: '30d' })

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    logger.info(`New user registered: ${email}`)
    return successResponse(reply, { user: user.toPublicProfile(), accessToken, refreshToken }, 'Account created', 201)

  } catch (err) {
    logger.error('Register error:', err)
    return errorResponse(reply, 'Registration failed', 500)
  }
}

// ── LOGIN ─────────────────────────────────────────────────────
const login = async (request, reply) => {
  try {
    const { email, password } = request.body

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) return errorResponse(reply, 'Invalid email or password', 401)
    if (!user.isActive) return errorResponse(reply, 'Account deactivated', 403)

    const isValid = await user.comparePassword(password)
    if (!isValid) return errorResponse(reply, 'Invalid email or password', 401)

    user.status   = 'online'
    user.lastSeen = new Date()

    const accessToken  = request.server.jwt.sign({ id: user._id, email: user.email, name: user.name })
    const refreshToken = request.server.jwt.sign({ id: user._id }, { expiresIn: '30d' })

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    logger.info(`User logged in: ${email}`)
    return successResponse(reply, { user: user.toPublicProfile(), accessToken, refreshToken }, 'Login successful')

  } catch (err) {
    logger.error('Login error:', err)
    return errorResponse(reply, 'Login failed', 500)
  }
}

// ── LOGOUT ────────────────────────────────────────────────────
const logout = async (request, reply) => {
  try {
    await User.findByIdAndUpdate(request.user.id, { status: 'offline', lastSeen: new Date(), refreshToken: null })
    logger.info(`User logged out: ${request.user.id}`)
    return successResponse(reply, null, 'Logged out successfully')
  } catch (err) {
    logger.error('Logout error:', err)
    return errorResponse(reply, 'Logout failed', 500)
  }
}

// ── REFRESH TOKEN ─────────────────────────────────────────────
const refreshToken = async (request, reply) => {
  try {
    const { refreshToken: token } = request.body
    if (!token) return errorResponse(reply, 'Refresh token required', 400)

    let decoded
    try { decoded = request.server.jwt.verify(token) }
    catch { return errorResponse(reply, 'Invalid or expired refresh token', 401) }

    const user = await User.findById(decoded.id).select('+refreshToken')
    if (!user || user.refreshToken !== token) return errorResponse(reply, 'Invalid refresh token', 401)

    const newAccessToken  = request.server.jwt.sign({ id: user._id, email: user.email, name: user.name })
    const newRefreshToken = request.server.jwt.sign({ id: user._id }, { expiresIn: '30d' })

    user.refreshToken = newRefreshToken
    await user.save({ validateBeforeSave: false })

    return successResponse(reply, { accessToken: newAccessToken, refreshToken: newRefreshToken }, 'Token refreshed')
  } catch (err) {
    logger.error('Refresh error:', err)
    return errorResponse(reply, 'Token refresh failed', 500)
  }
}

// ── GET ME ────────────────────────────────────────────────────
const getMe = async (request, reply) => {
  try {
    const user = await User.findById(request.user.id)
    if (!user) return errorResponse(reply, 'User not found', 404)
    return successResponse(reply, { user: user.toPublicProfile() })
  } catch (err) {
    logger.error('GetMe error:', err)
    return errorResponse(reply, 'Failed to get user', 500)
  }
}

export { register, login, logout, refreshToken, getMe }