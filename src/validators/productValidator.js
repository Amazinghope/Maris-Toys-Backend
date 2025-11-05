import Joi from "joi";

const createProduct = Joi.object({
   name: Joi.string().min(3).required(),
   price: Joi.number().required(),
   category: Joi.string().min(4).required(),
   ageRange: Joi.string().required(),
   skills: Joi.array().items(Joi.string()).required(),
   stock: Joi.number().required(),
   description: Joi.string().required(),
   
   })

   const updateProduct = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
 
   })
// {name, price, category, ageRange, skills, stock, rating, description }
export {createProduct, updateProduct}