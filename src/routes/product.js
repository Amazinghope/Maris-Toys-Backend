import express from 'express'
import getAllProducts from '../controllers/Products/allProduct.js'
import getSingleProduct from '../controllers/Products/singleProduct.js'
import { authorizeUser, checkRole } from '../middleware/auth.js';
import createProduct from '../controllers/Products/createProduct.js';
import updateProduct from '../controllers/Products/updateProduct.js';
import upload from '../middleware/uploads.js';
const router = express.Router();

router.get("/all-products",authorizeUser, getAllProducts)
router.get("/get-single-product/:id", authorizeUser, getSingleProduct)
router.post("/create-product", authorizeUser, checkRole('admin'), upload.single('image'), createProduct)
router.patch("/update-product", authorizeUser, checkRole('admin'), updateProduct)
export default router