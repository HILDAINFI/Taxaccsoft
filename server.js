const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files (e.g., HTML, CSS, JS)

// Route to handle form submission
app.post("/send-message", async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
        service: "gmail", // Use Gmail or another email service provider
        auth: {
            user: process.env.EMAIL, // Your email (stored in .env)
            pass: process.env.EMAIL_PASSWORD, // Your email password (stored in .env)
        },
    });

    // Email content
    const mailOptions = {
        from: email,
        to: process.env.RECEIVER_EMAIL, // Email where messages should be sent
        subject: `Contact Form: ${subject}`,
        text: `You have a new message from your contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).send("Failed to send message. Please try again later.");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
