
import mongoose from "mongoose";

const otpTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  expiredAt:{
    type: Date,
    required: true
  },
  
  otp:{
   type: String,
   required: true,
  },
  used: {
    type: Boolean,
    default: false    // ✅ crucial for finding valid OTPs
  },

  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const OtpToken = mongoose.model('OtpToken', otpTokenSchema)
export default OtpToken