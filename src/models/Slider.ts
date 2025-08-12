import mongoose, { Schema, Document } from 'mongoose'

export interface ISlider extends Document {
  title: string
  subtitle?: string
  description?: string
  image: string
  buttonText?: string
  buttonLink?: string
  order: number
  isActive: boolean
  backgroundColor?: string
  textColor?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

const SliderSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Başlık gereklidir'],
    trim: true,
    maxlength: [100, 'Başlık en fazla 100 karakter olabilir']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [150, 'Alt başlık en fazla 150 karakter olabilir']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Açıklama en fazla 500 karakter olabilir']
  },
  image: {
    type: String,
    required: [true, 'Görsel gereklidir']
  },
  buttonText: {
    type: String,
    trim: true,
    maxlength: [50, 'Buton metni en fazla 50 karakter olabilir']
  },
  buttonLink: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  backgroundColor: {
    type: String,
    default: '#000000'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  },
  createdBy: {
    type: String,
    required: [true, 'Oluşturan kullanıcı gereklidir']
  }
}, {
  timestamps: true
})

// Index'ler
SliderSchema.index({ order: 1 })
SliderSchema.index({ isActive: 1 })
SliderSchema.index({ createdAt: -1 })

const Slider = mongoose.models.Slider || mongoose.model<ISlider>('Slider', SliderSchema)

export default Slider
