import brevo from '@getbrevo/brevo'


/**
 * This function simulates your old "createTransporter" export
 * (it’s just a placeholder for compatibility)
 */
export const createTransporter = () => {
  console.log("📨 Brevo transporter initialized successfully.");
  return { provider: "Brevo", status: "active" };
};

/**
 * Sends OTP email using Brevo’s transactional email API
 */
export const sendOtpEmail = async (toEmail, otp) => {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const emailData = {
      sender: {
        name: process.env.BREVO_SENDER_NAME || "Maris Educreative Toys",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: toEmail }],
      subject: "Your OTP Verification Code",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background-color: #001f4d; color: white; padding: 16px; border-radius: 8px;">
          <h2>🔐 Login Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="font-size: 28px; color: #ffcc00;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p style="margin-top: 12px;">— Maris Educreative Toys</p>
        </div>
      `,
    };

    await apiInstance.sendTransacEmail(emailData);
    console.log("✅ OTP email sent successfully via Brevo");
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    throw new Error("Failed to send OTP email. Please try again later.");
  }
};


// const sendOtp = async(req, res) =>{
// try {
//     const {email} = req.body
//     const user = await User.findOne({email})

//     if(!user){
//         return res.status(httpStatus.NOT_FOUND).json({
//             message: 'User not found'
//         })
//            }

//             // Generate 6 digit otp
//         otpCode = Math.floor(100000 * Math.random() * 900000).toString()

//         // connect and save otp in database
//         await OtpToken.create({
//         userId: user._id,
//         otp: otpCode,
//         expiredAt: Date.now() + 5 * 60 * 1000
//         })

//         const transporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 587,
//             secure: false,
//             auth:{
//             user: process.env.GMAIL_USER,
//             pass: process.env.GMAIL_PASS,
//             }
//         })
//         await transporter.sendMail({
//         from: `Maris Educreative Toys < ${process.env.GMAIL_USER}> `,
//         to: user.email,
//         subject: "Your OTP Verification Code",
//         html: `<p style='background-color: midnightblue; color: white; padding: 10px;'> Your 
//         login OTP is <b> ${otpCode} </b>. It expires in 5 minutes </p> `

//         })

//         // send sms
//         if(user.phone){
//             const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
//             await client.messages.create({
//                 from: `Mari Educreative Toys  < ${process.env.GMAIL_USER}> `
//             })
//         }
// } catch (error) {
    
// }
// }


// export const createTransporter = () => {
//     //Use env var for Gmail app password:
//     // process.env.Gmail_USER = 'yourgmail.com'
//     // process.env.Gmail_PASS = 'app_password'
//     return  brevo.createTransport({
//         host: 'smtp',
        
//         auth: {
//             user: process.env.GMAIL_USER,
//             pass: process.env.GMAIL_PASS,
//         },
//     })

// }


// export const sendOtpEmail = async (toEmail, otp) => {
//   try {
//     const apiInstance = new brevo.TransactionalEmailsApi();
//     apiInstance.setApiKey(
//       brevo.TransactionalEmailsApiApiKeys.apiKey,
//       process.env.BREVO_API_KEY
//     );

//     const emailData = {
//       sender: {
//         name: process.env.BREVO_SENDER_NAME || "Maris Educreative Toys",
//         email: process.env.BREVO_SENDER_EMAIL,
//       },
//       to: [{ email: toEmail }],
//       subject: "Your OTP Verification Code",
//       htmlContent: `
//         <div style="font-family: Arial; background-color: #001f4d; color: white; padding: 16px; border-radius: 8px;">
//           <h2>🔐 Login Verification</h2>
//           <p>Your OTP code is:</p>
//           <h1 style="font-size: 28px; color: #ffcc00;">${otp}</h1>
//           <p>This code will expire in 10 minutes.</p>
//         </div>
//       `,
//     };

//     await apiInstance.sendTransacEmail(emailData);
//     console.log("✅ OTP email sent successfully via Brevo");
//     return true;
//   } catch (error) {
//     console.error("❌ Failed to send OTP email:", error.message);
//     throw new Error("Failed to send OTP email. Please try again later.");
//   }
// };


// export const sendOtpEmail = async (toEmail, otp) => {
//   try {
//     const transporter = createTransporter();
//     const mailOptions = {
//       from: `Maris Educreative Toys <${process.env.GMAIL_USER}>`,
//       to: toEmail,
//       subject: "Your OTP Verification Code",
//       html: `<p style='background-color: midnightblue; color: white; padding: 10px;'>Your 
//       login OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('✅ OTP email sent successfully');
//   } catch (error) {
//     console.error('❌ Failed to send OTP email:', error.message);
//     throw new Error('Failed to send OTP email. Please try again later.');
//   }
// };

// export const sendOtpEmail = async(toEmail, otp) =>{
//     const transporter = createTransporter()
//     const mailOptions =  {
//         from: process.env.GMAIL_USER,
//         to: toEmail,
//         subject: "Your recipe app otp",
//         text: `Your login otp is ${otp}. It expires in 10minutes `,
//         html: `<p style='background-color: midnightblue; color: white; padding: 10px;'> Your 
//         login OTP is <b> ${otp} </b>. It expires in 10 minutes </p> `
//     }

//     return transporter.sendMail(mailOptions)
// }