import mongoose, { Schema, Document } from 'mongoose'

export interface IAnnouncement extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featuredImage?: string
  images?: string[]
  fileUrl?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  publishDate: Date
  author: string
  views: number
  createdAt: Date
  updatedAt: Date
}

const AnnouncementSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Başlık gereklidir'],
    trim: true,
    maxlength: [200, 'Başlık en fazla 200 karakter olabilir']
  },
  slug: {
    type: String,
    required: [true, 'Slug gereklidir'],
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Özet gereklidir'],
    trim: true,
    maxlength: [500, 'Özet en fazla 500 karakter olabilir']
  },
  content: {
    type: String,
    required: [true, 'İçerik gereklidir']
  },
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    enum: ['genel', 'toplu-sozlesme', 'egitim', 'sosyal', 'hukuk', 'basin-aciklamasi'],
    default: 'genel'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    type: String,
    trim: true
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr: string[]) {
        return Array.isArray(arr) && arr.length <= 8
      },
      message: 'En fazla 8 görsel ekleyebilirsiniz'
    }
  },
  fileUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    required: [true, 'Yazar gereklidir'],
    default: 'Admin'
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index'ler
AnnouncementSchema.index({ slug: 1 })
AnnouncementSchema.index({ status: 1 })
AnnouncementSchema.index({ featured: 1 })
AnnouncementSchema.index({ category: 1 })
AnnouncementSchema.index({ publishDate: -1 })
AnnouncementSchema.index({ createdAt: -1 })

// Slug otomatik oluşturma
AnnouncementSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
      .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
      .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
      .trim()
  }
  next()
})

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema)
