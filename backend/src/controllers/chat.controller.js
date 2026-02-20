import Chat from '../models/Chat.model.js'
import Message from '../models/Message.model.js'
import User from '../models/User.model.js'
import { sendSuccess, sendError } from '../utils/response.helper.js'
import logger from '../utils/logger.js'

// POST /api/chats — create or get private chat
export const createOrGetPrivateChat = async (request, reply) => {
  try {
    const { userId } = request.body
    const myId = request.user.id

    if (userId === myId) return sendError(reply, 'Cannot chat with yourself', 400)

    const targetUser = await User.findById(userId)
    if (!targetUser) return sendError(reply, 'User not found', 404)

    // Check if private chat already exists
    let chat = await Chat.findOne({
      type: 'private',
      'members.user': { $all: [myId, userId] },
    }).populate('members.user', 'name email avatar status lastSeen')
     .populate({ path: 'lastMessage', populate: { path: 'sender', select: 'name' } })

    if (chat) return sendSuccess(reply, { chat }, 'Chat found')

    // Create new private chat
    chat = await Chat.create({
      type: 'private',
      members: [{ user: myId, role: 'member' }, { user: userId, role: 'member' }],
    })

    await chat.populate('members.user', 'name email avatar status lastSeen')
    return sendSuccess(reply, { chat }, 'Chat created', 201)
  } catch (err) {
    logger.error('CreateChat error:', err)
    return sendError(reply, 'Failed to create chat', 500)
  }
}

// POST /api/chats/group — create group chat
export const createGroupChat = async (request, reply) => {
  try {
    const { name, memberIds } = request.body
    const myId = request.user.id

    if (!name || !memberIds || memberIds.length < 2)
      return sendError(reply, 'Group name and at least 2 members required', 400)

    const allMembers = [...new Set([myId, ...memberIds])]
    const members = allMembers.map((id) => ({
      user: id,
      role: id === myId ? 'admin' : 'member',
    }))

    const chat = await Chat.create({ type: 'group', name, members })
    await chat.populate('members.user', 'name email avatar status')

    return sendSuccess(reply, { chat }, 'Group created', 201)
  } catch (err) {
    logger.error('CreateGroupChat error:', err)
    return sendError(reply, 'Failed to create group', 500)
  }
}

// GET /api/chats — get all my chats
export const getMyChats = async (request, reply) => {
  try {
    const chats = await Chat.find({
      'members.user': request.user.id,
      isActive: true,
    })
      .populate('members.user', 'name email avatar status lastSeen')
      .populate({ path: 'lastMessage', populate: { path: 'sender', select: 'name avatar' } })
      .sort({ updatedAt: -1 })

    return sendSuccess(reply, { chats })
  } catch (err) {
    logger.error('GetMyChats error:', err)
    return sendError(reply, 'Failed to fetch chats', 500)
  }
}

// GET /api/chats/:id — get single chat
export const getChatById = async (request, reply) => {
  try {
    const chat = await Chat.findOne({
      _id: request.params.id,
      'members.user': request.user.id,
    })
      .populate('members.user', 'name email avatar status lastSeen')
      .populate({ path: 'lastMessage', populate: { path: 'sender', select: 'name' } })

    if (!chat) return sendError(reply, 'Chat not found', 404)
    return sendSuccess(reply, { chat })
  } catch (err) {
    logger.error('GetChatById error:', err)
    return sendError(reply, 'Failed to fetch chat', 500)
  }
}