import mongoose from 'mongoose'

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Resmi Belgeler', 'Şablonlar', 'Formlar', 'Yönetmelikler', 'Toplantı Tutanakları', 'Mali Raporlar', 'Eğitim Materyalleri', 'Basın Açıklamaları', 'Diğer']
  },
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  author: {
    type: String,
    default: 'Admin'
  },
  downloads: {
    type: Number,
    default: 0
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index'ler
DocumentSchema.index({ title: 'text', description: 'text', tags: 'text' })
DocumentSchema.index({ category: 1 })
DocumentSchema.index({ status: 1 })
DocumentSchema.index({ isPrivate: 1 })

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema)


