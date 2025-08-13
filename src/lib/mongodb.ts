import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment değişkeni tanımlanmamış')
}

/**
 * Global MongoDB bağlantısı
 * Vercel'de serverless functions için optimize edildi
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached?.conn) {
    return cached.conn
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      // Vercel'de connection pooling için
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Vercel'de connection timeout
      connectTimeoutMS: 10000,
      // Vercel'de retry logic
      retryWrites: true,
      w: 'majority' as const
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB bağlantısı başarılı')
      return mongoose
    }).catch((error) => {
      console.error('❌ MongoDB bağlantı hatası:', error)
      cached!.promise = null
      throw error
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    console.error('❌ MongoDB bağlantı hatası:', e)
    throw e
  }

  return cached!.conn
}

// Vercel'de graceful shutdown için
if (process.env.NODE_ENV === 'production') {
  process.on('SIGTERM', async () => {
    if (cached?.conn) {
      await cached.conn.disconnect()
      console.log('MongoDB bağlantısı kapatıldı')
    }
    process.exit(0)
  })
}

export { connectDB }
export default connectDB

// Global type tanımı
declare global {
  var mongoose: {
    conn: any | null
    promise: Promise<any> | null
  } | undefined
}
