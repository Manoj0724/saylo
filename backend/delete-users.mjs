import dotenv from 'dotenv'
dotenv.config()

import { connectDB } from './src/plugins/database.js'
import User from './src/models/User.model.js'

await connectDB()
const result = await User.deleteMany({})
console.log('✅ Deleted', result.deletedCount, 'users!')
process.exit(0)