import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from  'path'
import { dbConnect } from './config/dbConnection.js'
import ProductRoute from './routes/product.js'
import OrderRoute  from './routes/order.js'
import UserRoute from './routes/users.js'


const app = express()
dotenv.config()

// Defining Port
const PORT = process.env.PORT || 4000;
if (process.env.ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(cors({
  origin: "http://localhost:5174", // frontend URL
  credentials: true, // allow cookies
}));

//Defining  Endpoint route
app.use('/api/products', ProductRoute)
app.use('/api/order', OrderRoute)
app.use('/api/users', UserRoute)

// configure server to start static file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Call app to listen to port

dbConnect().then(() =>{
    console.log("Database sucessfuly connected")
   app.listen(PORT, () => {
    console.log(`server running at port: ${PORT}`)
   })
}).catch((error) => {
    console.log(`An error occured while connecting to database: ${error}`)
   })

export default app

