import express from 'express'
import getUsers from '../controllers/users/getAllUsers.js'
import { authorizeUser, checkRole } from '../middleware/auth.js'

const router = express()
router.get('/get-all-users', authorizeUser, checkRole('admin'), getUsers )

export default router