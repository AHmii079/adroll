const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '')));

// Nodemailer transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.xdialnetworks.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'false' ? false : true, // false for 587/25, true for 465
    auth: {
        user: process.env.SMTP_USER || 'info@adrollinc.com',
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    // Fail fast instead of hanging Nginx
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
    debug: true,
    logger: true
});

app.post('/api/contact', async (req, res) => {
    try {
        const data = req.body;
        
        const email = data['request[anonymous_requester_email]'] || data.email || 'No Email Provided';
        const subject = data['request[subject]'] || data.subject || 'New Contact Form Submission';
        const description = data['request[description]'] || data.description || '';

        const mailOptions = {
            from: '"Adroll Static Form" <info@adrollinc.com>', // sender address
            to: 'info@adrollinc.com', // list of receivers
            subject: `Contact Form: ${subject}`, // Subject line
            text: `You have received a new contact submission.\n\nSender Email: ${email}\nSubject: ${subject}\n\nMessage:\n${description}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        
        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message', error: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Site and API server running on port ${PORT}`);
});
