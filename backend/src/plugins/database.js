import mongoose from 'mongoose'
import logger from '../utils/logger.js'

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI not defined in .env file')

  mongoose.connection.on('error', (err) => logger.error('MongoDB error:', err))
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'))

  await mongoose.connect(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 5000 })
}

const disconnectDB = async () => {
  await mongoose.disconnect()
  logger.info('MongoDB disconnected gracefully')
}

export { connectDB, disconnectDB }
