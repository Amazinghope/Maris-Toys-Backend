import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import User from '../models/user.js';

// const authorizeUser = (req, res, next) => {
//     // Check if token is provided in the headers
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(httpStatus.UNAUTHORIZED).json({
//             status: 'Unauthorized',
//             message: 'Token Not Provided!'
//         });
//     }

//     // Get Token from headers
//     const token = authHeader.split(' ')[1];
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Assuming decoded token contains user info
//         next();
//     } catch (error) {
//         let message = 'Unauthorized: Token failed';
//         if (error.name === 'TokenExpiredError') {
//             message = 'Unauthorized: Token has expired';
//         } else if (error.name === 'JsonWebTokenError') {
//             message = 'Unauthorized: Invalid token';
//         }
//         return res.status(httpStatus.UNAUTHORIZED).json({
//             status: 'Unauthorized',
//             message
//         });
//     }
// };

// const authorizeUser = (req, res, next) => {
//   // Try to get token from cookie or header
//   const token =
//     req.cookies?.token ||
//     (req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer ") &&
//       req.headers.authorization.split(" ")[1]);

//   if (!token) {
//     return res.status(httpStatus.UNAUTHORIZED).json({
//       status: "Unauthorized",
//       message: "Token not provided!",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     let message = "Invalid or expired token";
//     if (error.name === "TokenExpiredError") {
//       message = "Token expired";
//     } else if (error.name === "JsonWebTokenError") {
//       message = "Invalid token";
//     }

//     return res.status(httpStatus.UNAUTHORIZED).json({
//       status: "Error",
//       message,
//     });
//   }
// };

 const authorizeUser = async (req, res, next) => {
  try {
    // Get token from cookie first
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

    // Find user by ID in DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "User not found",
      });
    }

    req.user = user; // attach user to request
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
