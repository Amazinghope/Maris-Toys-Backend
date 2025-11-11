// routes/contact.js
import express from "express";
import SibApiV3Sdk from "sib-api-v3-sdk";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;
    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    await tranEmailApi.sendTransacEmail({
      sender: { email: process.env.BREVO_SENDER_EMAIL, name: "Your Portfolio" },
      to: [{ email: process.env.YOUR_EMAIL, name: "Your Name" }],
      subject: `📩 New Contact Message from ${name}`,
      htmlContent: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
