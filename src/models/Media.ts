import mongoose, { Schema, Document, Model } from 'mongoose'

export interface MediaDocument extends Document {
  title: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  category?: string
  tags: string[]
  status: 'draft' | 'published'
  uploadDate: Date
  size?: string
  width?: number
  height?: number
  createdAt: Date
  updatedAt: Date
}

const MediaSchema = new Schema<MediaDocument>({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true },
  thumbnail: { type: String },
  category: { type: String, default: 'Genel' },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  uploadDate: { type: Date, default: Date.now },
  size: { type: String },
  width: { type: Number },
  height: { type: Number }
}, { timestamps: true })

MediaSchema.index({ status: 1, category: 1, uploadDate: -1 })
MediaSchema.index({ title: 'text', category: 'text', tags: 'text' })

const Media: Model<MediaDocument> = mongoose.models.Media || mongoose.model<MediaDocument>('Media', MediaSchema)
export default Media

