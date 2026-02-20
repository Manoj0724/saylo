import mongoose from 'mongoose'
import logger from '../utils/logger.js'

export const connectDB = async () => {
  const uri =
    process.env.MONGO_URL ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    'mongodb://localhost:27017/saylo'

  logger.info('Connecting to MongoDB: ' + uri.substring(0, 30) + '...')

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
  })

  logger.info('✅ MongoDB connected!')
}