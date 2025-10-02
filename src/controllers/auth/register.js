import { registerValidationSchema } from "../../validators/authValidator.js";
import httpStatus  from 'http-status'
import bcrypt from 'bcrypt'
import User from "../../models/user.js";
import jwt from "jsonwebtoken"
// import { encrypt } from "../../utils/crypto.js";


// Controller Function To Register Users

  const registerUser = async(req, res) =>{
    try{
     //validate the req body with the registervalidationschema
     const {error} = registerValidationSchema.validate(req.body);
     
     if (error){
      return res.status(httpStatus.BAD_REQUEST).json({
         status: 'validation Error',
         message: error.details[0].message,
      })
     };


     const {name, username, password, email, role} = req.body;
     const emailExist = await User.findOne({
        email,
     });

     if(emailExist){
        res.status(httpStatus.BAD_REQUEST).json({
            status: 'Error',
            message: 'User with Email already exist'
        });
     }
      
     const userNameExist = await User.findOne({
        username,
     });

     if(userNameExist){
     res.status(httpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: 'UserName already exist'
     });
     }
     
     // Hash your password before saving to data base.
     
     const hashedPassword = await bcrypt.hash(password,10);

     //Encrypt username name but store only ciphertext
    //  const encryptedUserName = encrypt(username)

     // Create and save user details to the data base
     const createdUser = await User.create({
        name: name,
        username: username,
        email: email,
        password: hashedPassword,
        role: role,
     });

    //  const token = signToken()

     // Send a response (as view after registration)
     res.status(httpStatus.CREATED).json({
        status: 'Success',
        message: 'User registration successful',
        userDetails: createdUser,
        

     })
     
    // Bellow is an alternative way of sending a response

    //  res.status(httpStatus.CREATED).json({
    //     status: 'Success',
    //     message: 'User registration successful',
    //     userDetails:{
    //      name: name,
    //      username: username,
    //      email: email,
    //      role: role,
    //     }
    //  }) 
    }catch(err){
     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'Error',
        message: 'An error occurred while registering user',
        err: err.message,
     })
    }

};

export {registerUser}