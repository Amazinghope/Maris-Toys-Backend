import express from 'express'
import { getUsers, getCurrentUser, getAdmins } from '../controllers/users/getAllUsers.js'
import { authorizeUser, checkRole } from '../middleware/auth.js'
import { getCurrentAdmin } from '../controllers/users/currentAdmin.js'
import { changePassword } from '../controllers/users/changePassword.js'


const router = express()
router.get('/get-all-users', authorizeUser, checkRole('admin'), getUsers )
router.get("/me", authorizeUser, getCurrentUser);
router.get("/admins", authorizeUser, getAdmins);
router.get("/current-admin",  authorizeUser, getCurrentAdmin)
router.put('/change-password',authorizeUser, changePassword)



export default router