import mongoose, { Schema, Document, Model } from 'mongoose'

export interface PressItemDocument extends Document {
  title: string
  type: 'tv' | 'radio' | 'newspaper' | 'online'
  outlet: string
  date: Date
  status: 'draft' | 'published' | 'archived'
  views: number
  shares: number
  url?: string
  fileUrl?: string
  thumbnail?: string
  images?: string[]
  summary?: string
  category?: string
  createdAt: Date
  updatedAt: Date
}

const PressItemSchema = new Schema<PressItemDocument>({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['tv', 'radio', 'newspaper', 'online'], required: true },
  outlet: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  views: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  url: { type: String },
  fileUrl: { type: String },
  thumbnail: { type: String },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr: string[]) {
        return Array.isArray(arr) && arr.length >= 0 && arr.length <= 8
      },
      message: 'Görsel sayısı en fazla 8 olabilir'
    }
  },
  summary: { type: String },
  category: { type: String }
}, { timestamps: true })

PressItemSchema.index({ title: 'text', summary: 'text', outlet: 'text', category: 'text' })

const PressItem: Model<PressItemDocument> = mongoose.models.PressItem || mongoose.model<PressItemDocument>('PressItem', PressItemSchema)

export default PressItem
