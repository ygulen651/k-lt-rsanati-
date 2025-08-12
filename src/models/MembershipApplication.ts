import mongoose from 'mongoose'

const membershipApplicationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  tcNumber: String,
  birthDate: Date,
  address: {
    street: String,
    city: String,
    district: String,
    zipCode: String
  },
  workInfo: {
    workplace: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    department: String,
    startDate: Date
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  applicationReason: String,
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  },
  reviewedAt: Date,
  reviewNotes: String
}, {
  timestamps: true
})

export default mongoose.models.MembershipApplication || mongoose.model('MembershipApplication', membershipApplicationSchema)