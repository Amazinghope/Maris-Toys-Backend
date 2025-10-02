import Product from "../../models/product.js";
import httpStatus from 'http-status'

const updateProduct = async(req, res) => {
    try {
        const {name, price, stock} = req.body
        const {id} = req.params

        let product
        product = await Product.findById(id)
        if(!product){
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'Not Found',
                message: 'Failed to retrieve item'
            })
        }

        const editProduct = {}
        if(name) editProduct.name = name
        if(price) editProduct.price = price
        if(stock) editProduct.stock = stock

       product = await Product.findByIdAndUpdate(id, editProduct, {new: true})
      res.status(httpStatus.OK).json({
        status: 'Success',
        productDetails: product,
      })
                
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'Server Error',
        message: error.message
      }) 
    }
}
export default updateProduct