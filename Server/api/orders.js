const router = require("express").Router();
const db = require("../db");

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
  const { order_number, user_id, product_id, quantity } = req.body;
  try {
    const { rows } = await db.query(
      "INSERT INTO orders (order_number, user_id, product_id, quantity) VALUES ($1, $2, $3, $4) RETURNING *;",
      [order_number, user_id, product_id, quantity]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
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
