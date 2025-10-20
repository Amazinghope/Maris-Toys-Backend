import User from "../../models/user.js";
import { createAndSaveOtp } from "../../utils/generateOtp.js";
import httpStatus from "http-status";
import { sendOtpEmail } from "../../utils/email.js";

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

    // 2️⃣ Generate a new OTP
    const { otp } = await createAndSaveOtp(userId);

    // 3️⃣ Send OTP (via email or any other means)
    // If you’re not using email yet, just log it for now:
    console.log(`📩 New OTP for ${user.email}: ${otp}`);

    // Optionally send by email:
    await sendOtpEmail(user.email, "Your New OTP", `Your verification code is ${otp}`);

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
