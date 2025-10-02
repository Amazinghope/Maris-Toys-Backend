import Product from "../../models/product.js";
import  httpStatus from 'http-status'

// controller to get all products
const getAllProducts = async (req, res) => {
    try {
    const allProducts = await Product.find()
    if(allProducts){
         res.status(httpStatus.OK).json({
        status: 'success',
        productDetails: allProducts
    })

    } else {return res.status(httpStatus.NOT_FOUND).json({
        status: "Not Found",
        message: "No record(s) found!",
      });
}
       } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server Error',
        error: error.message
      })
    }
};

export default getAllProducts


