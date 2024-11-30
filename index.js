const cors = require("cors");
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const contact = async (req, res) => {
  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: "eslamhafez044@gmail.com",
    subject: "New Contact Form Submission",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1E90FF;">${email}</a></p>
      <p><strong>Message:</strong></p>
      <p style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #4CAF50; margin: 10px 0;">
        ${message}
      </p>
      <hr style="border: none; border-top: 1px solid #ccc;" />
      <p style="font-size: 0.9em; color: #555;">This email was sent automatically from your website's contact form.</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
app.get("/", (req, res) => {
  res.send("Server works successfully");
});

app.post("/api/contact", contact);

console.log(process.env.EMAIL);
console.log(process.env.PASSWORD);
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on http://localhost:3000");
});
