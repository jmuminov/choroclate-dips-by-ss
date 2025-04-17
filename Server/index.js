const express = require("express");
const app = express();
const cors = require("cors");
const { seed } = require("./db/seed");

// Import routes
const usersRouter = require("./api/users");
const productsRouter = require("./api/products");
const cartRouter = require("./api/cart");
const ordersRouter = require("./api/orders");
const authRouter = require("./api/auth");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);

// Seed the database
seed();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 