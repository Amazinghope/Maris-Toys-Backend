import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginvalidationSchema } from "../../validators/authValidator.js";
import User from "../../models/user.js";
import { sendOtpEmail } from "../../utils/email.js";
import { createAndSaveOtp } from "../../utils/generateOtp.js";

const login = async (req, res) => {
  try {
    // 1. Validate request body
    const { error } = loginvalidationSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Error",
        message: error.details[0].message,
      });
    }

    // 2. Extract data
    const { email, password } = req.body;

    // 3. Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "Login Error",
        message: "User not found",
      });
    }

    // 4. Validate password
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Error",
        message: "Invalid email or password",
      });
    }

    // 5. Generate and send OTP
    const { otp } = await createAndSaveOtp(
      userExists._id,
      Number(process.env.OTP_EXPIRE_MINUTES || 10)
    );

    try {
      await sendOtpEmail(userExists.email, otp);
    } catch (mailError) {
      console.error(mailError.message);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "Error",
        message: "Failed to send OTP email. Please try again later.",
      });
    }

    // 6. Create temporary token for OTP session
    const tempToken = jwt.sign(
      { sub: userExists._id.toString(), type: "otp" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 7. Respond to user
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "OTP sent successfully to your email",
      tempToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      message: err.message,
    });
  }
};

export { login };


// import httpStatus from "http-status";
// import bcrypt from "bcrypt";
// import { loginvalidationSchema } from "../../validators/authValidator.js";
// import User from "../../models/user.js";
// import { jwtToken } from "../../utils/generateTokens.js";
// import { sendOtpEmail } from "../../utils/email.js";
// import { createAndSaveOtp } from "../../utils/generateOtp.js";


// const login = async (req, res) => {
//   try {
//     // 1. Validate request body
//     const { error } = loginvalidationSchema.validate(req.body);
//     if (error) {
//       return res.status(httpStatus.BAD_REQUEST).json({
//         status: "Error",
//         message: error.details[0].message,
//       });
//     }

//     // 2. Extract data
//     const { email, password } = req.body;

//     // 3. Check if user exists
//     const userExists = await User.findOne({ email });
//     if (!userExists) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         status: "Login Error",
//         message: "User Not Found",
//       });
//     }



//     // 4. Validate password
//     const isConfirmed = await bcrypt.compare(password, userExists.password);
//     if (!isConfirmed) {
//       return res.status(httpStatus.BAD_REQUEST).json({
//         status: "Error",
//         message: "Credentials not correct",
//       });
//     }

//     // credentials valid -> create otp and send email
//   const {otp} = await createAndSaveOtp(
//     userExists._id,
//     Number(process.env.OTP_EXPIRE_MINUTES || 10)
//   )

//   // send otp via email
//   try {
//     await sendOtpEmail(userExists.email, otp)

//   } catch (mailError) {
//     console.log(mailError.message)
//    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       status: 'error',
//       message: 'Failed to send OTP email. Please try again later'
//     })
//   }

//   // create a short-lived temp token to  identify this otp session
//   const tempToken = jwt.sign(
//     {sub: userExists._id.toString(), type: "otp"},
//     process.env.JWT_SECRET,
//     {expiresIn: "15m"}
//   )
  
//   return res.status(httpStatus.OK).json({
//     status: "Success",
//     message: 'OTP sent successfully',
//     tempToken: tempToken,
//     // token: (userExists._id, userExists.email, userExists.role),
//   });

//     // 5. Generate JWT token
//     const token = jwtToken(userExists._id, userExists.email, userExists.role);

//     // 6. Set cookie (only way token is returned)
//     res.cookie("token", token, {
//       httpOnly: true,                               // protect from JS access
//       secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
//       sameSite: "lax",                              // CSRF protection
//       maxAge: 7 * 24 * 60 * 60 * 1000,              // 7 days
//     });

//     // 7. Send back safe user info (no password)
//     const { password: _, ...safeUser } = userExists.toObject();

//     return res.status(httpStatus.OK).json({
//       status: "Success",
//       user: safeUser,
//     });

//   } catch (err) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       status: "Error",
//       message: err.message,
//     });
//   }
// };

// export { login };

// // import httpStatus from 'http-status'
// // import bcrypt from 'bcrypt'
// // import { loginvalidationSchema } from '../../validators/authValidator.js';
// // import User from '../../models/user.js';
// // import { jwtToken } from '../../utils/generateTokens.js';

// // const login = async(req, res) =>{
// // try{
// //     // validate the req body with loginvalidationschema
// //     const {error} = loginvalidationSchema.validate(req.body);
// //     if(error){
// //         return res.status(httpStatus.BAD_REQUEST).json({
// //             status: 'Error',
// //             message: error.details[0].message
// //         })
// //     }
// //     // Collect data from req body
// //   const {email, password} = req.body;

// //   //check if user is registered
// //   const userExists = await User.findOne({
// //     email: email,
// //   });

// //   if(!userExists){
// //     res.status(httpStatus.NOT_FOUND).json({
// //     status: "Login Error",
// //     message: "User Not Found",
// //      });

// //      return;
// //   }

// //   //check if password is correct
// //   const isConfirmed = await comparePassword(password, userExists.password) 
// //   if(!isConfirmed){
// //    return res.status(httpStatus.BAD_REQUEST).json({
// //         status:"error",
// //         message: "Credential Not Correct",

// //     });
// //   }

// //   const token = jwtToken(userExists._id);
// //     res.cookie("token", token, {
// //       httpOnly: true, // protect from JS access
// //       secure: process.env.NODE_ENV === "Production", 
// //       sameSite: "lax",   // CSRF protection CSRF (Cross-Site Request Forgery)
// //       maxAge: 7 * 24 * 60 * 60 * 1000,              // 7 days

// //     });

// //   res.status(httpStatus.OK).json({
// //     status: "Success",
// //     data: userExists,
// //     token: jwtToken(userExists._id, userExists.email, userExists.role),
// //   });

// //   async function comparePassword(plainPassword, hashedPassword) {
// //     return bcrypt.compare(plainPassword, hashedPassword)
// //   }
// // }catch(err){
// //    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
// //     status: "Error",
// //     message: err.message,
// //    })  
// // }
// // };

// // export { login}
