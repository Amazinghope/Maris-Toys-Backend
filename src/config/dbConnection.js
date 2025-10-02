import mongoose from "mongoose";

// Function to connect to database

export  const dbConnect  = ()  =>{
    try {
       return mongoose.connect(process.env.MONGO_URI)  
       
    } catch (error) {
        console.error(`Error: ${error.message}`);
    process.exit(1);

    }
   
}