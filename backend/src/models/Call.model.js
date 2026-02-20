import mongoose from 'mongoose'

const callSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: null },
        leftAt: { type: Date, default: null },
        status: {
          type: String,
          enum: ['invited', 'joined', 'declined', 'missed', 'left'],
          default: 'invited',
        },
      },
    ],
    type: { type: String, enum: ['audio', 'video'], required: true },
    status: {
      type: String,
      enum: ['ringing', 'ongoing', 'ended', 'missed'],
      default: 'ringing',
    },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    duration: { type: Number, default: 0 }, // seconds
  },
  { timestamps: true }
)

callSchema.index({ chat: 1, createdAt: -1 })

const Call = mongoose.model('Call', callSchema)
export default Call