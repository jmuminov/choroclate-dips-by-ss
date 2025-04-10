const router = require("express").Router();
const db = require("../db");

// Get all cart items for a user
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const { rows } = await db.query("SELECT * FROM cart WHERE user_id = $1;", [userId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

// Add an item to the cart
router.post("/", async (req, res) => {
    const { product_id, quantity, user_id } = req.body;
    try {
        const { rows } = await db.query("INSERT INTO cart (product_id, quantity, user_id) VALUES ($1, $2, $3) RETURNING *;", [product_id, quantity, user_id]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

// Update an item in the cart
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        const { rows } = await db.query("UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *;", [quantity, id]);
        if (rows.length === 0) {
            return res.status(404).send("Cart item not found.");
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

// Delete an item from the cart
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query("DELETE FROM cart WHERE id = $1 RETURNING *;", [id]);
        if (rows.length === 0) {
            return res.status(404).send("Cart item not found.");
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

module.exports = router;