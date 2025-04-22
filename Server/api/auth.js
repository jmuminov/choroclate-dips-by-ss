const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // In production, use environment variable

// Register a new user
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await db.query(
      "INSERT INTO users (username, password, is_admin) VALUES ($1, $2, FALSE) RETURNING id, is_admin",
      [email, hashedPassword]
    );

    const userId = userResult.rows[0].id;
    const isAdmin = userResult.rows[0].is_admin;

    // Create user info
    await db.query(
      "INSERT INTO user_info (firstname, lastname, email, user_id) VALUES ($1, $2, $3, $4)",
      [firstname, lastname, email, userId]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, firstname, lastname, isAdmin },
      JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.status(201).json({
      token,
      user: { id: userId, email, firstname, lastname, isAdmin }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);

  try {
    // Find user
    const userResult = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userResult.rows[0];
    console.log("User found:", { id: user.id, username: user.username, is_admin: user.is_admin });

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Get user info
    const userInfoResult = await db.query(
      "SELECT * FROM user_info WHERE user_id = $1",
      [user.id]
    );

    if (userInfoResult.rows.length === 0) {
      console.log("User info not found for user:", email);
      return res.status(401).json({ message: "User information not found" });
    }

    const userInfo = userInfoResult.rows[0];
    console.log("User info found:", { 
      firstname: userInfo.firstname, 
      lastname: userInfo.lastname,
      email: userInfo.email 
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.username, 
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        isAdmin: user.is_admin
      },
      JWT_SECRET,
      { expiresIn: "30m" }
    );

    console.log("Login successful for user:", email);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.username,
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        isAdmin: user.is_admin
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Verify token
router.get("/verify", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user info
    const userInfoResult = await db.query(
      "SELECT * FROM user_info WHERE user_id = $1",
      [decoded.userId]
    );

    if (userInfoResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const userInfo = userInfoResult.rows[0];

    res.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        isAdmin: decoded.isAdmin
      }
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router; 