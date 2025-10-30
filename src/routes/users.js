import express from 'express'
import { getUsers, getCurrentUser, getAdmins } from '../controllers/users/getAllUsers.js'
import { authorizeUser, checkRole } from '../middleware/auth.js'


const router = express()
router.get('/get-all-users', authorizeUser, checkRole('admin'), getUsers )
router.get("/me", authorizeUser, getCurrentUser);
router.get("/admins", authorizeUser, getAdmins);


export default router