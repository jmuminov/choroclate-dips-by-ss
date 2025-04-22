const express = require("express");
const app = express();
const cors = require("cors");
const { seed } = require("./db/seed");
const { runMigrations } = require("./db/migrations");

// Import routes
const usersRouter = require("./api/users");
const productsRouter = require("./api/products");
const cartRouter = require("./api/cart");
const ordersRouter = require("./api/orders");
const authRouter = require("./api/auth");
const contactRouter = require("./api/contact");
const unavailableDatesRouter = require("./api/unavailable_dates");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);
app.use("/api/contact", contactRouter);
app.use("/api/unavailable-dates", unavailableDatesRouter);

// Run migrations and start server
async function startServer() {
  try {
    await runMigrations();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer(); 