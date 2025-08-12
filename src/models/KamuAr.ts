import mongoose, { Schema, Document, Model } from 'mongoose'

export interface KamuArDocument extends Document {
  title: string
  slug: string
  excerpt?: string
  content?: string
  category?: string
  tags: string[]
  coverImage?: string
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

const KamuArSchema = new Schema<KamuArDocument>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  category: { type: String, default: 'genel' },
  tags: { type: [String], default: [] },
  coverImage: { type: String },
  images: {
    type: [String],
    default: [],
    validate: {
      validator(arr: string[]) { return Array.isArray(arr) && arr.length <= 8 },
      message: 'En fazla 8 görsel ekleyebilirsiniz'
    }
  },
  fileUrl: { type: String },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  featured: { type: Boolean, default: false },
  publishDate: { type: Date, default: Date.now },
  author: { type: String, default: 'Admin' },
  views: { type: Number, default: 0 }
}, { timestamps: true })

KamuArSchema.index({ slug: 1 })
KamuArSchema.index({ status: 1 })
KamuArSchema.index({ category: 1 })
KamuArSchema.index({ publishDate: -1 })
KamuArSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' })

const KamuAr: Model<KamuArDocument> = mongoose.models.KamuAr || mongoose.model<KamuArDocument>('KamuAr', KamuArSchema)
export default KamuAr
