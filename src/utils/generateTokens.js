// Load environmental variables from .env file
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';

dotenv.config();
const {JWT_SECRET, JWT_EXPIRY} = process.env;

export const jwtToken = (id, email,role) =>{
    return JWT.sign({id, email, role}, JWT_SECRET, {expiresIn: JWT_EXPIRY,});
};