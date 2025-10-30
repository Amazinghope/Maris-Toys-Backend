import User from "../../models/user.js";
import { createAndSaveOtp } from "../../utils/generateOtp.js";
import httpStatus from "http-status";
import { sendOtpEmail } from "../../utils/email.js";
import jwt from "jsonwebtoken";

export const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "Error",
        message: "User not found!",
      });
    }
    

const tempToken = jwt.sign(
  { sub: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "10m" } // valid for 10 minutes
);

res.cookie("tempToken", tempToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 10 * 60 * 1000, // 10 minutes
});


    // 2️⃣ Generate a new OTP
    const { otp } = await createAndSaveOtp(userId);

    // 3️⃣ Send OTP (via email or any other means)
    // If you’re not using email yet, just log it for now:
    console.log(`📩 New OTP for ${user.email}: ${otp}`);

    // Optionally send by email:
    await sendOtpEmail(user.email, otp);

    // 4️⃣ Respond success
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "New OTP has been sent successfully!",
    });
  } catch (err) {
    console.error("Resend OTP error:", err.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      message: err.message,
    });
  }
};
