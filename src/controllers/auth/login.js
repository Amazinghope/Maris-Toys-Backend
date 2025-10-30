import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginvalidationSchema } from "../../validators/authValidator.js";
import User from "../../models/user.js";
import { sendOtpEmail } from "../../utils/email.js";
import { createAndSaveOtp } from "../../utils/generateOtp.js";

const login = async (req, res) => {
  try {
    //  Validate request body
    const { error } = loginvalidationSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Error",
        message: error.details[0].message,
      });
    }

    //  Extract data
    const { email, password } = req.body;

    //  Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "Login Error",
        message: "User not found",
      });
    }

    //  Validate password
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Error",
        message: "Invalid email or password",
      });
    }

    //  Generate and send OTP
    const { otp } = await createAndSaveOtp(
      userExists._id,
      Number(process.env.OTP_EXPIRE_MINUTES || 10)
    );

    try {
      await sendOtpEmail(userExists.email, otp);
    } catch (mailError) {
      console.error(mailError.message);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "Error",
        message: "Failed to send OTP email. Please try again later.",
      });
    }

    //  Create temporary token for OTP session
    const tempToken = jwt.sign(
      { sub: userExists._id.toString(), type: "otp" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    //Save tempToken in a cookie (instead of localStorage)
  res.cookie("tempToken", tempToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
 sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 15 * 60 * 1000, // 15 minutes
});
console.log("🔧 Setting tempToken cookie:", res.getHeaders()["set-cookie"]);


    //  Respond to user
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "OTP sent successfully to your email",
      tempToken,
      userId: userExists._id
    });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      message: err.message,
    });
  }
};

export { login };


