import express  from 'express'
import { createOrder, getOrderById, getUserOrders, getAllOrders } from '../controllers/Orders/orders.js'
import { authorizeUser, checkRole } from '../middleware/auth.js'


const router = express.Router();

router.post('/create-order', authorizeUser, createOrder)
router.get('/get-users-order', authorizeUser, getUserOrders)
router.get('/get-all-order', authorizeUser, checkRole('admin'), getAllOrders)
router.get('/get-order/:id', authorizeUser, getOrderById)
export default router