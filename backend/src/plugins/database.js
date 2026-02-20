import mongoose from 'mongoose'

// ── SPEC: Connect to MongoDB with retry ───────────────────
// - Read URI from environment variable
// - Retry up to 5 times if connection fails
// - Wait 5 seconds between retries
// - Exit process if all retries fail

const MAX_RETRIES = 5
const RETRY_DELAY = 5000

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is missing!')
    console.error('Set it in Railway Variables tab')
    process.exit(1)
  }

  console.log('🔄 Connecting to MongoDB...')

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
        maxPoolSize: 10,
      })
      console.log('✅ MongoDB connected successfully!')
      return
    } catch (err) {
      console.error(`❌ MongoDB attempt ${attempt}/${MAX_RETRIES} failed:`, err.message)

      if (attempt === MAX_RETRIES) {
        console.error('❌ All MongoDB connection attempts failed. Exiting.')
        process.exit(1)
      }

      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds...`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
    }
  }
}