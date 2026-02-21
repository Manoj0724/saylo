import Chat from '../models/Chat.model.js'
import User from '../models/User.model.js'
import Message from '../models/Message.model.js'
import { successResponse, errorResponse } from '../utils/response.helper.js'
import logger from '../utils/logger.js'

// ── GET ALL MY CHATS ──────────────────────────────────────────
const getChats = async (request, reply) => {
  try {
    const userId = request.user.id

    const chats = await Chat.find({
      'participants.user': userId,
      isActive: true,
    })
      .populate('participants.user', 'name email avatar status lastSeen')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'name' },
      })
      .sort({ lastActivity: -1 })

    // Add lastMessageText for easy display in sidebar
    const formatted = chats.map(chat => {
      const obj = chat.toObject()
      if (obj.lastMessage) {
        obj.lastMessageText = obj.lastMessage.content || ''
      }
      return obj
    })

    return successResponse(reply, formatted)
  } catch (err) {
    logger.error('getChats error:', err)
    return errorResponse(reply, 'Failed to get chats', 500)
  }
}

// ── CREATE OR GET DIRECT CHAT ─────────────────────────────────
// If a direct chat already exists between 2 users, return it.
// If not, create a new one.
const createOrGetDirectChat = async (request, reply) => {
  try {
    const userId   = request.user.id
    const { targetUserId } = request.body

    if (!targetUserId) return errorResponse(reply, 'targetUserId is required', 400)
    if (targetUserId === userId) return errorResponse(reply, 'Cannot chat with yourself', 400)

    // Check target user exists
    const targetUser = await User.findById(targetUserId)
    if (!targetUser) return errorResponse(reply, 'User not found', 404)

    // Look for existing direct chat between these 2 users
    const existing = await Chat.findOne({
      type: 'direct',
      isActive: true,
      'participants.user': { $all: [userId, targetUserId] },
      $expr: { $eq: [{ $size: '$participants' }, 2] },
    })
      .populate('participants.user', 'name email avatar status lastSeen')
      .populate('lastMessage')

    if (existing) {
      const obj = existing.toObject()
      if (obj.lastMessage) obj.lastMessageText = obj.lastMessage.content || ''
      return successResponse(reply, obj)
    }

    // Create new direct chat
    const chat = await Chat.create({
      type: 'direct',
      participants: [
        { user: userId,       role: 'member' },
        { user: targetUserId, role: 'member' },
      ],
    })

    const populated = await Chat.findById(chat._id)
      .populate('participants.user', 'name email avatar status lastSeen')

    logger.info(`Direct chat created: ${userId} ↔ ${targetUserId}`)
    return successResponse(reply, populated, 'Chat created', 201)

  } catch (err) {
    logger.error('createOrGetDirectChat error:', err)
    return errorResponse(reply, 'Failed to create chat', 500)
  }
}

// ── CREATE GROUP CHAT ─────────────────────────────────────────
const createGroupChat = async (request, reply) => {
  try {
    const userId = request.user.id
    const { name, participantIds } = request.body

    if (!name || name.trim().length < 2) return errorResponse(reply, 'Group name is required (min 2 chars)', 400)
    if (!participantIds || participantIds.length < 1) return errorResponse(reply, 'Add at least 1 participant', 400)

    // Build participants array — creator is admin
    const allIds = [...new Set([userId, ...participantIds])]
    const participants = allIds.map(id => ({
      user: id,
      role: id === userId ? 'admin' : 'member',
    }))

    const chat = await Chat.create({ type: 'group', name: name.trim(), participants })
    const populated = await Chat.findById(chat._id)
      .populate('participants.user', 'name email avatar status')

    logger.info(`Group chat created: "${name}" by ${userId}`)
    return successResponse(reply, populated, 'Group created', 201)

  } catch (err) {
    logger.error('createGroupChat error:', err)
    return errorResponse(reply, 'Failed to create group', 500)
  }
}

// ── DELETE / LEAVE CHAT ───────────────────────────────────────
const deleteChat = async (request, reply) => {
  try {
    const userId = request.user.id
    const { chatId } = request.params

    const chat = await Chat.findOne({ _id: chatId, 'participants.user': userId })
    if (!chat) return errorResponse(reply, 'Chat not found', 404)

    // For direct chats — mark inactive
    // For group chats — remove user from participants
    if (chat.type === 'direct') {
      chat.isActive = false
      await chat.save()
    } else {
      chat.participants = chat.participants.filter(p => p.user.toString() !== userId)
      if (chat.participants.length === 0) chat.isActive = false
      await chat.save()
    }

    return successResponse(reply, null, 'Chat removed')
  } catch (err) {
    logger.error('deleteChat error:', err)
    return errorResponse(reply, 'Failed to delete chat', 500)
  }
}

export { getChats, createOrGetDirectChat, createGroupChat, deleteChat }