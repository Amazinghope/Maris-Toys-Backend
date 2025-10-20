import Product from "../../models/product.js";
import httpStatus from 'http-status'

const deleteProduct = async(req, res) =>{
    try {
        const {id} = req.params
        let product 
        product = await Product.findById(id) 
        if(!product){
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'Not found',
                message: 'No record found'

            })
        }
        product = await Product.findByIdAndDelete(id)
         res.status(httpStatus.OK).json({
        status: 'success',
        message: `Product with id: ${id} has been successfully deleted`
        })
    } catch (error) {
       return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'Error',
            message: 'No product found',
            error: error.message
        })
 
    }
}

export default deleteProduct