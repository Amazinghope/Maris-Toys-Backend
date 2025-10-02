// import httpStatus from 'http-status';
// import Product from '../../models/product';

// // GET /api/products
// export const getProducts = async (req, res) => {
//   // Add simple filters later if needed (category, age, q)
//   const products = await Product.find({});
//   res.status(httpStatus.OK).json({
//     status: 'Success',
//     message: products,
// });
// };

// // GET /api/products/:id
// export const getProductById = async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (product) res.json(product);
//   else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// };
