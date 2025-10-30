import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import User from '../models/user.js';


//  const authorizeUser = async (req, res, next) => {
//   try {
//     // Get token from cookie first
//     const token =
//       req.cookies?.token ||
//       (req.headers.authorization?.startsWith("Bearer ") &&
//         req.headers.authorization.split(" ")[1]);

//     if (!token) {
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         message: "No token, authorization denied",
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//      // Handle both "id" and "sub" just in case
//     const userId = decoded.id || decoded.sub;


//     // Find user by ID in DB
//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) {
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         message: "User not found",
//       });
//     }

//     req.user = user; // attach user to request
//     next();
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     return res.status(httpStatus.UNAUTHORIZED).json({
//       message: "Invalid or expired token",
//     });
//   }
// };
 const authorizeUser = async (req, res, next) => {
  try {
    
    // Get token from cookie or header
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "No token, authorization denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Handle both "id" and "sub" just in case
    const userId = decoded.id || decoded.sub;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid token payload: no user id",
      });
    }

    // Find user
    const user = await User.findById(userId).select("-password");
     console.log("Decoded token:", decoded);
console.log("User found:", user);

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "User not found",
      });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid or expired token",
    });
  }
};

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user role is provided and is within allowed roles
        const userRole = req.user?.role; // Assuming your token includes a 'role' property
        if (!allowedRoles.includes(userRole)) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'FORBIDDEN',
                message: 'FORBIDDEN: Access denied!'
            });
        }
        next();
    }
};

export { authorizeUser, checkRole };
