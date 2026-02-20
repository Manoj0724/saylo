import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['private', 'group'],
      default: 'private',
    },
    name: {
      type: String,
      default: null, // only for group chats
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
        joinedAt: { type: Date, default: Date.now },
        lastRead: { type: Date, default: null }, // for unread count
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Index for fast member lookups
chatSchema.index({ 'members.user': 1 })

const Chat = mongoose.model('Chat', chatSchema)
export default Chat