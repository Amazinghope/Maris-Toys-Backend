import Message from "../../models/messages.js";
import { validateMessage } from "../../validators/messageValidation.js";
import User from "../../models/user.js";
import SibApiV3Sdk from "sib-api-v3-sdk"

export const sendMessage = async (req, res) => {
  try {
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const senderId = req.user._id;
    const { receiverId, content } = req.body;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    const newMessage = await Message.create({ senderId, receiverId, content });

    // ✅ Email notification setup
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;
    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    await tranEmailApi.sendTransacEmail({
    //   sender: { email: "noreply@edutoy.com", name: "EduToy Support" },
    sender: { email: process.env.BREVO_SENDER_EMAIL, name: "Maris Educreative Toy Store" },
     to: [{ email: receiver.email, name: receiver.name }],
      subject: `📩 New Message from ${sender.name}`,
      htmlContent: `
        <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto;">
          <h2>Hello ${receiver.name},</h2>
          <p>You’ve received a new message from <b>${sender.name}</b>:</p>
          <blockquote style="background:#f8f8f8; padding:10px; border-left:3px solid #4B9CD3;">
            ${content}
          </blockquote>
          <p>Visit your dashboard to reply.</p>
          <br/>
          <p>— EduToy Support Team</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully & email notification delivered.",
      data: newMessage,
    });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// // ✅ Send Message
// export const sendMessage = async (req, res) => {
//   try {
//     const { error } = validateMessage(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     const senderId = req.user._id;
//     const { receiverId, content } = req.body;

//     const receiver = await User.findById(receiverId);
//     if (!receiver) return res.status(404).json({ message: "Receiver not found" });

//     const newMessage = await Message.create({ senderId, receiverId, content });

//     res.status(201).json({
//       success: true,
//       message: "Message sent successfully",
//       data: newMessage,
//     });
//   } catch (err) {
//     console.error("Error sending message:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// ✅ Get Conversation
export const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email role")
      .populate("receiverId", "name email role");

    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
