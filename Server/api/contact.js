const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Log email configuration (without exposing sensitive data)
console.log('Email Configuration:', {
  user: process.env.EMAIL_USER,
  hasPassword: !!process.env.EMAIL_PASS,
  envLoaded: !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS
});

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Transporter verification failed:', error);
  } else {
    console.log('Transporter is ready to send emails');
  }
});

// Contact form submission endpoint
router.post('/', async (req, res) => {
  try {
    console.log('1. Received request body:', req.body);
    
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      console.log('2. Missing fields:', { name, email, message });
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('3. Creating mail options...');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'chocolatedipsllc@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<h3>New Contact Form Submission</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
    };

    console.log('4. Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('5. Email sent successfully:', info);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('ERROR DETAILS:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message,
      code: error.code
    });
  }
});

module.exports = router; 