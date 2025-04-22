const router = require("express").Router();
const db = require("../db");
const { generateOrderNumber } = require("../utils/orderUtils");
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../../.env' });

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

// Get all orders for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const { rows } = await db.query(
      "SELECT * FROM orders WHERE user_id = $1;",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Get an order by ID
router.get("/:userId/:orderId", async (req, res) => {
  const { userId, orderId } = req.params;
  try {
    const { rows } = await db.query(
      "SELECT * FROM orders WHERE user_id = $1 AND id = $2;",
      [userId, orderId]
    );
    if (rows.length === 0) {
      return res.status(404).send("Order not found.");
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Create a new order
router.post("/", async (req, res) => {
  const { items, selectedDate, specialRequests, user_id, userEmail } = req.body;
  const orderNumber = generateOrderNumber();
  
  try {
    // Start a transaction
    await db.query('BEGIN');

    // Create an order for each item
    for (const item of items) {
      await db.query(
        `INSERT INTO orders (
          order_number, 
          user_id, 
          product_id, 
          quantity, 
          selected_date, 
          special_requests
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [
          orderNumber, 
          user_id && !isNaN(user_id) ? parseInt(user_id) : null, 
          item.id, 
          item.quantity, 
          selectedDate, 
          specialRequests
        ]
      );
    }

    // Clear the user's cart after successful order creation
    if (user_id) {
      await db.query(
        "DELETE FROM cart WHERE user_id = $1;",
        [user_id]
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    // Send confirmation email
    console.log('1. Creating mail options...');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      cc: process.env.EMAIL_USER,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4b2e83;">Order Confirmation</h2>
          <p>Thank you for your order! Here are your order details:</p>
          
          <h3 style="color: #4b2e83;">Order Number: ${orderNumber}</h3>
          
          <h4 style="color: #4b2e83;">Order Items:</h4>
          <ul>
            ${items.map(item => `
              <li>
                ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
              </li>
            `).join('')}
          </ul>
          
          <div style="margin-top: 20px;">
            <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
            <p><strong>Tax (8%):</strong> $${tax.toFixed(2)}</p>
            <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          </div>
          
          <div style="margin-top: 20px;">
            <h4 style="color: #4b2e83;">Pickup Details:</h4>
            <p><strong>Date:</strong> ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
            ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <p>Please complete your payment before pickup. You can pay using Zelle or Cash App as shown in the checkout process.</p>
          </div>
          
          <div style="margin-top: 20px; font-size: 12px; color: #666;">
            <p>If you have any questions, please contact us at ${process.env.EMAIL_USER}</p>
          </div>
        </div>
      `
    };

    console.log('2. Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('3. Email sent successfully:', info);

    // Commit the transaction
    await db.query('COMMIT');
    
    res.status(201).json({ orderNumber, message: 'Order created successfully' });
  } catch (err) {
    // Rollback the transaction in case of error
    await db.query('ROLLBACK');
    console.error('ERROR DETAILS:', {
      message: err.message,
      code: err.code,
      command: err.command,
      response: err.response,
      responseCode: err.responseCode,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Failed to create order', 
      details: err.message,
      code: err.code
    });
  }
});

// Update an order
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { order_number, user_id, product_id, quantity } = req.body;
  try {
    const { rows } = await db.query(
      "UPDATE orders SET order_number = $1, user_id = $2, product_id = $3, quantity = $4 WHERE id = $5 RETURNING *;",
      [order_number, user_id, product_id, quantity, id]
    );
    if (rows.length === 0) {
      return res.status(404).send("Order not found.");
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Delete an order
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      "DELETE FROM orders WHERE id = $1 RETURNING *;",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).send("Order not found.");
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
