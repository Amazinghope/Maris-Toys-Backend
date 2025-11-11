import User from "../../models/user.js";
import OtpToken from "../../models/otpToken.js";
import httpStatus from "http-status";
import { jwtToken } from "../../utils/generateTokens.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const verifyOtp = async (req, res) => {
  try {
    
    //  Extract and verify tempToken from cookies
    const token = req.cookies.tempToken;
    if (!token)
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: "Error",
        message: "Session expired or missing token. Please log in again.",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.sub; // extracted from tempToken
    const { otp } = req.body;

   console.log("📩 Received OTP verification request:");
    console.log("User ID:", userId);
    console.log("Entered OTP:", otp);
    
    // Find OTP record
    const otpRecord = await OtpToken.findOne({ userId, used: false });
    console.log("🔍 OTP record found:", otpRecord);

    if (!otpRecord)
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Error",
        message: "OTP not found or already used!",
      });

      // compare hashed otp with provided otp
      const isMatch = await bcrypt.compare(otp, otpRecord.otp)
      console.log("🔐 Comparing entered OTP:", otp, "with hashed:", otpRecord.otp);
     console.log("✅ OTP match result:", isMatch);

      if(!isMatch){
        return res.status(httpStatus.NOT_FOUND).json({
        status: "Error",
        message: "Invalid OTP",
      });
      }
     
    //  Check expiry
    if (otpRecord.expiredAt < new Date()) {
      await OtpToken.deleteOne({ _id: otpRecord._id });
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Error",
        message: "OTP expired",
      });
    }

    //  Mark user as verified
    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   { isVerified: true, isOnline:true},
    //   { new: true },
      
    // );

    // ✅ Mark user as verified and online
let user = await User.findByIdAndUpdate(userId);
if (!user) {
  return res.status(404).json({
    status: "Error",
    message: "User not found during OTP verification",
  });
}

user.isVerified = true;
user.isOnline = true;
await user.save();

console.log(" User verified and online:", user);


    //  mark as used
    await OtpToken.updateOne({ _id: otpRecord._id }, {used: true});

    //  Create JWT token for login session
    const loginToken = jwtToken(user._id, user.email, user.role);

    // Clear Temporary token
    res.clearCookie("tempToken")

    //  Set token in secure HTTP-only cookie (not localStorage)
    res.cookie("token", loginToken, {
      httpOnly: true,                               // not accessible via JS
      secure: process.env.NODE_ENV === "production", // only over HTTPS in production
     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // protect against CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days
    });

    //  Respond with success excluding password
    const { password: _, ...safeUser } = user.toObject();
    console.log("✅ Logged-in user data:", safeUser);

    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Account verified successfully. Logged in!",
      user: safeUser,
      
    });
    
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      message: err.message,
    });
  }
};


