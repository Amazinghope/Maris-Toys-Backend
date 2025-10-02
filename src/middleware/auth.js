import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'

const authorizeUser = (req, res, next) => {
    // Check if token is provided in the headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: 'Unauthorized',
            message: 'Token Not Provided!'
        });
    }

    // Get Token from headers
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Assuming decoded token contains user info
        next();
    } catch (error) {
        let message = 'Unauthorized: Token failed';
        if (error.name === 'TokenExpiredError') {
            message = 'Unauthorized: Token has expired';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Unauthorized: Invalid token';
        }
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: 'Unauthorized',
            message
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
