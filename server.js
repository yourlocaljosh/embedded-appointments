// optional(?) node.js
// install packages:
// npm init -y
// npm install express nodemailer
// node server.js

const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/appointments', (req, res) => {
    const appointmentData = req.body;

    // Log to a file
    const logEntry = `${new Date().toISOString()} - ${JSON.stringify(appointmentData)}\n`;
    fs.appendFile('appointments.txt', logEntry, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).send({ message: 'Failed to log appointment.' });
        }
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {//REPLACE THIS WITH WHICHEVER EMAIL SHOULD RECEIVE CONFIRMATION DETAILS
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });
//replace this with the same thing as above
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'tutor@gmail.com',
        subject: 'New Appointment Scheduled',
        text: `Appointment Details:\n${JSON.stringify(appointmentData, null, 2)}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email', error);
            return res.status(500).send({ message: 'Failed to send email.' });
        }
        console.log('Email sent:', info.response);
        res.status(200).send({ message: 'Appointment logged and email sent successfully.' });
    });
});

app.listen(PORT, () => { // server ip change to whichever needs to be
    console.log(`Server running on http://localhost:${PORT}`);
});
