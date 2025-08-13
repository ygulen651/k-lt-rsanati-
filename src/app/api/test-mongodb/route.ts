import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 MongoDB Test API çağrıldı')
    
    // MongoDB'ye bağlan
    console.log('📡 MongoDB\'ye bağlanılıyor...')
    await connectDB()
    console.log('✅ MongoDB bağlantısı başarılı!')
    
    // Database bilgilerini al
    const db = mongoose.connection.db
    const collections = await db.listCollections().toArray()
    
    // Collection'lardan veri sayılarını al
    const collectionStats = []
    for (const collection of collections) {
      try {
        const count = await db.collection(collection.name).countDocuments()
        collectionStats.push({
          name: collection.name,
          count: count
        })
      } catch (error) {
        collectionStats.push({
          name: collection.name,
          count: 'error',
          error: error.message
        })
      }
    }
    
    // Environment variables kontrolü
    const envCheck = {
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Not Set',
      NODE_ENV: process.env.NODE_ENV || 'Not Set',
      VERCEL: process.env.VERCEL ? '✅ Yes' : '❌ No',
      VERCEL_ENV: process.env.VERCEL_ENV || 'Not Set'
    }
    
    const result = {
      success: true,
      message: 'MongoDB bağlantısı başarılı',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        name: db.databaseName,
        collections: collectionStats,
        totalCollections: collections.length
      },
      connection: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      }
    }
    
    console.log('📊 Test sonuçları:', result)
    
    return NextResponse.json(result)
    
  } catch (error: any) {
    console.error('❌ MongoDB Test hatası:', error)
    
    const errorResult = {
      success: false,
      message: 'MongoDB bağlantısı başarısız',
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      environment: {
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
        NODE_ENV: process.env.NODE_ENV || 'Not Set',
        VERCEL: process.env.VERCEL ? 'Yes' : 'No'
      }
    }
    
    return NextResponse.json(errorResult, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    if (action === 'ping') {
      // Basit ping testi
      await connectDB()
      
      return NextResponse.json({
        success: true,
        message: 'Ping başarılı',
        timestamp: new Date().toISOString(),
        connection: {
          readyState: mongoose.connection.readyState,
          host: mongoose.connection.host
        }
      })
    }
    
    if (action === 'query') {
      // Basit veri sorgusu testi
      await connectDB()
      const db = mongoose.connection.db
      
      // Örnek veri sorgusu
      const users = await db.collection('users').find({}).limit(5).toArray()
      const events = await db.collection('events').find({}).limit(5).toArray()
      
      return NextResponse.json({
        success: true,
        message: 'Veri sorgusu başarılı',
        timestamp: new Date().toISOString(),
        data: {
          users: users.length,
          events: events.length,
          sampleUser: users[0] ? { email: users[0].email, role: users[0].role } : null,
          sampleEvent: events[0] ? { title: events[0].title, date: events[0].date } : null
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Geçersiz action',
      validActions: ['ping', 'query']
    }, { status: 400 })
    
  } catch (error: any) {
    console.error('❌ MongoDB Test POST hatası:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Test başarısız',
      error: error.message
    }, { status: 500 })
  }
}
