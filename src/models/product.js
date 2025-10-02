// import { required } from "joi";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    category:{
        type: String,
        required: true
    },

    ageRange:{
        type: String, 
        required: true
    },

    stock:{
        type: Number,
        required: true
    },

    rating: {
        type:Number,
        default: 4.5
    },

    description: {
        type: String
    },

    skills: [String],
    image: {
        type: String
    },
},
{
    timestamps: true
}
);

const Product = mongoose.model("Product", productSchema)
export default Product