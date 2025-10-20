// import { required, string } from "joi";
import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema({
   product:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
   },
   name: String,
   price: Number,
   qty: Number,
   image: String,    
});

const shippingSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,

})

const orderSchema = new mongoose.Schema({
    items: [orderProductSchema],
    shippingAddress: shippingSchema,
   
    paymentMethod:{
    type: String,
    default: "cod" // card / transfer/ cod
    },

    totalPrice: {
        type: Number,
        required: true
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link recipe to User model
      required: true,
    },

    status: {
        type: String,
        default: "pending" // pending, processing, shipped, completed
    },

},

{
   timestamps: true 
}
);

const Order = mongoose.model("Order", orderSchema)
export  default Order