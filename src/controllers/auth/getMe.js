import User from "../../models/user.js";
import jwt from 'jsonwebtoken'

export const getMe = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User fetched from DB:", user);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getMe:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
