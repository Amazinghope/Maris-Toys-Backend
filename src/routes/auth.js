import express from 'express'
import { registerUser } from '../controllers/auth/register.js'
import { login } from '../controllers/auth/login.js'
import { verifyOtp } from '../controllers/auth/otpVerification.js'
import { resendOtp } from '../controllers/auth/resendOtp.js'
import { authorizeUser, checkRole } from '../middleware/auth.js'
import { logout } from '../controllers/auth/logOut.js'
import { getMe } from '../controllers/auth/getMe.js'
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', login)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.get('/me', authorizeUser, getMe)
router.post('/log-out', authorizeUser, logout)


export default router