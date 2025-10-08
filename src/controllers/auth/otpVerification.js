import User from "../../models/user.js";
import OtpToken from "../../models/otpToken.js";
import httpStatus from "http-status";
import { jwtToken } from "../../utils/generateTokens.js";

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // 1️⃣ Find OTP record
    const otpRecord = await OtpToken.findOne({ userId, otp });
    if (!otpRecord)
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Error",
        message: "Invalid OTP",
      });

    // 2️⃣ Check expiry
    if (otpRecord.expiredAt < new Date()) {
      await OtpToken.deleteOne({ _id: otpRecord._id });
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Error",
        message: "OTP expired",
      });
    }

    // 3️⃣ Mark user as verified
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );

    // 4️⃣ Delete OTP record after successful verification
    await OtpToken.deleteOne({ _id: otpRecord._id });

    // 5️⃣ Create JWT token for login session
    const token = jwtToken(user._id, user.email, user.role);

    // 6️⃣ Set token in secure HTTP-only cookie (not localStorage)
    res.cookie("token", token, {
      httpOnly: true,                               // not accessible via JS
      secure: process.env.NODE_ENV === "production", // only over HTTPS in production
      sameSite: "lax",                              // protect against CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000,              // 7 days
    });

    // 7️⃣ Respond with success
    const { password: _, ...safeUser } = user.toObject();

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

// import User from "../../models/user.js";
// import OtpToken from "../../models/otpToken.js";
// import httpStatus from "http-status";

// export const verifyOtp = async (req, res) => {
//   try {
//     const { userId, otp } = req.body;

//     const otpRecord = await OtpToken.findOne({ userId, otp });
//     if (!otpRecord)
//       return res.status(httpStatus.BAD_REQUEST).json({
//         status: "Error",
//         message: "Invalid OTP",
//       });

//     if (otpRecord.expiredAt < new Date()) {
//       await OtpToken.deleteOne({ _id: otpRecord._id });
//       return res.status(httpStatus.BAD_REQUEST).json({
//         status: "Error",
//         message: "OTP expired",
//       });
//     }

//     await User.findByIdAndUpdate(userId, { isVerified: true });
//     await OtpToken.deleteOne({ _id: otpRecord._id });

//     return res.status(httpStatus.OK).json({
//       status: "Success",
//       message: "Account verified successfully",
//     });
//   } catch (err) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       status: "Error",
//       message: err.message,
//     });
//   }
// };
