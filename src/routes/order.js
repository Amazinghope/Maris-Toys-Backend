import express  from 'express'
import { createOrder, getOrderById } from '../controllers/Orders/orders.js'
import { authorizeUser, checkRole } from '../middleware/auth.js'

const router = express.Router();

router.get('/get-order/:id', authorizeUser, getOrderById)
router.post('/create-order', authorizeUser, createOrder)

export default router