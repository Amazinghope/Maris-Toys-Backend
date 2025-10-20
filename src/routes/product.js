import express from 'express'
import getAllProducts from '../controllers/Products/allProduct.js'
import getSingleProduct from '../controllers/Products/singleProduct.js'
import { authorizeUser, checkRole } from '../middleware/auth.js';
import createProduct from '../controllers/Products/createProduct.js';
import updateProduct from '../controllers/Products/updateProduct.js';
import deleteProduct from '../controllers/Products/deleteProduct.js';
// import upload from '../middleware/uploads.js';

const router = express.Router();
//upload.single('image'),
router.get("/all-products",  getAllProducts)
router.get("/get-single-product/:id", authorizeUser, getSingleProduct)
router.post("/create-product", authorizeUser, checkRole('admin'),  createProduct)
router.patch("/update-product/:id", authorizeUser, checkRole('admin'), updateProduct)
router.delete("/del-product/:id", authorizeUser, checkRole('admin'), deleteProduct)
export default router