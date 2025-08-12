import mongoose, { Schema, Document } from 'mongoose'

export interface BoardMemberDocument extends Document {
  name: string
  position: string
  bio?: string
  photo?: string
  email?: string
  phone?: string
  group: 'yonetim-kurulu' | 'merkez-yonetim-kurulu' | 'merkez-denetleme-kurulu' | 'merkez-disiplin-kurulu'
  order?: number
}

const BoardMemberSchema = new Schema<BoardMemberDocument>({
  name: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  bio: { type: String },
  photo: { type: String },
  email: { type: String },
  phone: { type: String },
  group: { 
    type: String, 
    required: true, 
    enum: ['yonetim-kurulu','merkez-yonetim-kurulu','merkez-denetleme-kurulu','merkez-disiplin-kurulu']
  },
  order: { type: Number, default: 0 }
}, { timestamps: true })

BoardMemberSchema.index({ group: 1, name: 1, position: 1 }, { unique: true })

export default mongoose.models.BoardMember || mongoose.model<BoardMemberDocument>('BoardMember', BoardMemberSchema)


