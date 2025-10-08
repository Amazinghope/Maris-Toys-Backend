import bcrypt from 'bcrypt'
import OtpToken from '../models/otpToken.js'

 const generateNumericOtp = () =>{
 // 6-digit numeric OTP
 return  Math.floor(100000 + Math.random() * 900000).toString()
}

export const createAndSaveOtp = async(userId, expireMinutes = 10) =>{
// invalidates previous used Otps for the user
await OtpToken.updateMany({
    userId, 
    used: false
},
{
    used: true
}
)
 const otp = generateNumericOtp()
 const otpHash = await bcrypt.hash(otp, 10);
 const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000)

 const doc = await OtpToken.create({
    userId,
    otp: otpHash,         // field name must match schema
    expiredAt: expiresAt, // field name must match schema
 })

 return {otp, doc}
}