const router = require("express").Router();
const db = require("../db");

// Get all products
router.get("/", async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM products;");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

// Get a product by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query("SELECT * FROM products WHERE id = $1;", [id]);
        if (rows.length === 0) {
            return res.status(404).send("Product not found.");
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

// Create a new product
router.post("/", async (req, res) => {
    const { name, price, description, image } = req.body;
    try {
        const { rows } = await db.query("INSERT INTO products (name, price, description, image) VALUES ($1, $2, $3, $4) RETURNING *;", [name, price, description, image]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

// Update a product
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, price, description, image } = req.body;
    try {
        const { rows } = await db.query("UPDATE products SET name = $1, price = $2, description = $3, image = $4 WHERE id = $5 RETURNING *;", [name, price, description, image, id]);
        if (rows.length === 0) {
            return res.status(404).send("Product not found.");
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

// Delete a product
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query("DELETE FROM products WHERE id = $1 RETURNING *;", [id]);
        if (rows.length === 0) {
            return res.status(404).send("Product not found.");
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

module.exports = router;