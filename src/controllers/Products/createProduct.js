import Product from "../../models/product.js";
import httpStatus from "http-status";

 const createProduct = async (req, res) => {
  try {
    const { name, price, category, ageRange, stock, skills, description, image } = req.body;
   
    if (!name || !price) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        message: "Name and price are required",
      });
    }
   const existingName = await Product.findOne({
    name
   })
   if(existingName){
    return res.status(httpStatus.BAD_REQUEST).json({
      status: 'Error',
      message: 'Name Already Exist'
    })
   }
    const newProduct = await Product.create({
      name,
      price,
      category,
      ageRange,
      stock,
      skills,
      description,
      image,
    });

    res.status(httpStatus.CREATED).json({
      status: "success",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: error.message,
    });
  }
};

export default createProduct
