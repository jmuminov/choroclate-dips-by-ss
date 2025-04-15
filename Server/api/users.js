const router = require("express").Router();
const db = require("../db");

// Deny access if user is not logged in
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send("You must be logged in to do that.");
  }
  next();
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM users;");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Get a user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE id = $1;", [id]);
    if (rows.length === 0) {
      return res.status(404).send("User not found.");
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Get user's info based on user ID
router.get("/:id/info", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      "SELECT * FROM user_info WHERE user_id = $1;",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).send("User info not found.");
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Create a new user
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;",
      [username, password]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Create a new user info entry
router.post("/:id/info", async (req, res) => {
  const { id } = req.params;
  const { fullname, email } = req.body;
  try {
    const { rows } = await db.query(
      "INSERT INTO user_info (fullname, email, user_id) VALUES ($1, $2, $3) RETURNING *;",
      [fullname, email, id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Update user's info based on user ID
router.put("/:id/info", async (req, res) => {
  const { id } = req.params;
  const { fullname, email } = req.body;
  try {
    await db.query(
      "UPDATE user_info SET fullname = $1, email = $2 WHERE user_id = $3;",
      [fullname, email, id]
    );
    res.send("User info updated successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Update user's password
router.put("/:id/password", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    await db.query("UPDATE users SET password = $1 WHERE id = $2;", [
      password,
      id,
    ]);
    res.send("Password updated successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

// Delete a user and user info by user ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM user_info WHERE user_id = $1;", [id]);
    await db.query("DELETE FROM users WHERE id = $1;", [id]);
    res.send("User deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
