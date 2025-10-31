import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'// needed for socket io
import { Server } from 'socket.io'// live chat
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import path from  'path'
import { dbConnect } from './config/dbConnection.js'
import ProductRoute from './routes/product.js'
import OrderRoute  from './routes/order.js'
import AuthRoute from './routes/auth.js'
import UserRoute from './routes/users.js'
import MessageRoute from './routes/messages.js'

const app = express()
dotenv.config()

// Defining Port
const PORT = process.env.PORT || 4000;
const httpServer = http.createServer(app)

//Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: [
       "http://localhost:5173",
      "http://localhost:5174",
      "https://maris-toys-frontend.onrender.com",
    ],
    credentials: true
  }
})

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(' New client connected:', socket.id);

  // Join a room for a specific user
 socket.on('join_room', (roomId) =>{
  socket.join(roomId)
  console.log(`Socket ${socket.id} joined room ${roomId}`);
 })
 // Send message event
socket.on('send_message', (data) =>{
  const {roomId, message} = data;

  // Broadcast to everyone in the room except sender
 socket.to(roomId).emit('receive_message', message)
})
 socket.on('disconnect', () => {
  console.log('❌ Client disconnected:', socket.id);

 })
})

// Express middleware
if (process.env.ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())
// app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://maris-toys-frontend.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ This allows cookies
  })
);


//Defining  Endpoint route
app.use('/api/products', ProductRoute)
app.use('/api/order', OrderRoute)
app.use('/api/auth', AuthRoute)
app.use('/api/users', UserRoute)
app.use('/api/messages', MessageRoute)


// Add root route
// Health check route for uptime monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Backend server is healthy and running smoothly.",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("✅ Backend is running... Welcome to Maris Toys API!");
})


// configure server to start static file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Call app to listen to port

dbConnect().then(() =>{
    console.log("Database sucessfuly connected")
  //  app.listen(PORT, () => {
  //   console.log(`server running at port: ${PORT}`)
  //  })
   httpServer.listen(PORT, () => {
    console.log(`🚀 Server running with Socket.IO at port: ${PORT}`);
  });
}).catch((error) => {
    console.log(`An error occured while connecting to database: ${error}`)
   })

export default app

