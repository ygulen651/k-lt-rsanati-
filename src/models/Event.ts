import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
  title: string
  slug: string
  description: string
  date: Date
  time: string
  endDate?: Date
  endTime?: string
  location: string
  address?: string
  category: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  maxParticipants?: number
  currentParticipants: number
  registrationRequired: boolean
  registrationDeadline?: Date
  contactEmail?: string
  contactPhone?: string
  featuredImage?: string
  gallery?: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Etkinlik başlığı gereklidir'],
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
  description: {
    type: String,
    required: [true, 'Etkinlik açıklaması gereklidir']
  },
  date: {
    type: Date,
    required: [true, 'Etkinlik tarihi gereklidir']
  },
  time: {
    type: String,
    required: [true, 'Etkinlik saati gereklidir'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı girin (HH:MM)']
  },
  endDate: {
    type: Date
  },
  endTime: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı girin (HH:MM)']
  },
  location: {
    type: String,
    required: [true, 'Etkinlik yeri gereklidir'],
    trim: true,
    maxlength: [200, 'Konum en fazla 200 karakter olabilir']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Adres en fazla 500 karakter olabilir']
  },
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    enum: ['toplanti', 'egitim', 'seminer', 'kutlama', 'protesto', 'sosyal', 'spor', 'kultur'],
    default: 'toplanti'
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
  maxParticipants: {
    type: Number,
    min: [1, 'Maksimum katılımcı sayısı en az 1 olmalıdır']
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: [0, 'Mevcut katılımcı sayısı negatif olamaz']
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date
  },
  contactEmail: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir e-posta adresi girin']
  },
  contactPhone: {
    type: String,
    match: [/^[\+]?[0-9\s\-\(\)]+$/, 'Geçerli bir telefon numarası girin']
  },
  featuredImage: {
    type: String,
    trim: true
  },
  gallery: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: String,
    required: [true, 'Oluşturan kişi gereklidir'],
    default: 'Admin'
  }
}, {
  timestamps: true
})

// Index'ler
EventSchema.index({ slug: 1 })
EventSchema.index({ status: 1 })
EventSchema.index({ featured: 1 })
EventSchema.index({ category: 1 })
EventSchema.index({ date: 1 })
EventSchema.index({ createdAt: -1 })

// Slug otomatik oluşturma
EventSchema.pre('save', function(next) {
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

// Katılımcı sayısı kontrolü
EventSchema.pre('save', function(next) {
  if (this.maxParticipants && this.currentParticipants > this.maxParticipants) {
    next(new Error('Mevcut katılımcı sayısı maksimum katılımcı sayısını aşamaz'))
  }
  next()
})

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)
