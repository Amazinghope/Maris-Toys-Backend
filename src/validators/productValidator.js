import Joi from "joi";

const createProduct = Joi.object({
   name: Joi.string().min(3).required(),
   price: Joi.number().required(),
   category: Joi.string().min(4).required(),
   ageRange: Joi.string().required(),
   skills: Joi.array().items(Joi.string()).required(),
   stock: Joi.number().required(),
   description: Joi.string().required(),
   rating: Joi.number(),
   })

   const updateProduct = Joi.object({
    price: Joi.number().required(),
    stock: Joi.number().required(),
    name: Joi.string()
   })
// {name, price, category, ageRange, skills, stock, rating, description }
export {createProduct, updateProduct}