import mongoose from "mongoose";
import bcrypt from 'bcrypt'
// import { required } from "joi";

const userSchema = new mongoose.Schema({
 name:{
    type: String,
    required: true,
 },

 email:{
    type: String,
    required: true,
    unique: true,
 },

 username:{
    type: String,
    required: true,
    unique: true,
 },


 password:{
    type: String,
    required: true,
 },
 role:{
    type: String,
    enum:['regular', 'admin'],
    default: 'regular'
 },

},
{timestamps: true}
)

const User = mongoose.model('User',  userSchema)
export default User