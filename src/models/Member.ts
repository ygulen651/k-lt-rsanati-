import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
  memberNumber: {
    type: String,
    required: true,
    unique: true
  },
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
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  tcNumber: {
    type: String,
    required: true,
    unique: true
  },
  birthDate: {
    type: Date
  },
  profileImage: {
    type: String
  },
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
    startDate: Date,
    salary: Number
  },
  membershipInfo: {
    membershipType: {
      type: String,
      enum: ['active', 'passive', 'retired', 'suspended'],
      default: 'active'
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    dues: {
      amount: {
        type: Number,
        default: 100
      },
      status: {
        type: String,
        enum: ['paid', 'unpaid', 'overdue'],
        default: 'unpaid'
      },
      lastPayment: Date
    }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  notes: String
}, {
  timestamps: true
})

export default mongoose.models.Member || mongoose.model('Member', memberSchema)