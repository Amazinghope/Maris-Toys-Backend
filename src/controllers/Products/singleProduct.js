import Product from "../../models/product.js";
import httpStatus from 'http-status'

// controller to get single product
const getSingleProduct = async (req, res) => {
    try {
        // Another method of getting by params id (const {id} = req.params)   
        const product  = await Product.findById(req.params.id) 
        if(product){
            res.status(httpStatus.OK).json({
                status: 'Success',
                productDetails: product
            })
        } else{
            res.status(httpStatus.NOT_FOUND).json({
                status: 'Product not found',
                message: `product with id: ${id} does not exist.`
            })
        }
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Server Error',
            error: error.message
        })
    }
};

export default getSingleProduct