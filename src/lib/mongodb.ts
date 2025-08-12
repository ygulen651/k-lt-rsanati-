import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment değişkeni tanımlanmamış')
}

/**
 * Global MongoDB bağlantısı
 * Development modunda hot reload sırasında bağlantıları önbelleğe alır
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
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      console.log('MongoDB bağlantısı başarılı')
      return mongoose
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    console.error('MongoDB bağlantı hatası:', e)
    throw e
  }

  return cached!.conn
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
