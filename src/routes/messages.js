import express from 'express'
import { sendMessage, getConversation } from "../controllers/messages/messages.js";
import { authorizeUser } from "../middleware/auth.js";

 const router = express.Router()
 router.post("/send", authorizeUser, sendMessage);
router.get("/conversation/:receivedId", authorizeUser, getConversation);
export default router

