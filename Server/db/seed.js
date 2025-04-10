const db = require("../db");

async function seed() {
  console.log("Seeding the database.");
  try {
    // Clear the database.
    await db.query("DROP TABLE IF EXISTS cart, orders, products, user_info, users;");

    // Recreate the tables
    await db.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        );
        CREATE TABLE user_info (
          id SERIAL PRIMARY KEY,
          fullname TEXT NOT NULL,
          email TEXT NOT NULL,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price NUMERIC NOT NULL,
          description TEXT NOT NULL,
          image TEXT NOT NULL
        );
        CREATE TABLE cart (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL DEFAULT 1,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        );
        CREATE TABLE orders (
          id SERIAL PRIMARY KEY,
          order_number TEXT NOT NULL,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL DEFAULT 1,
          order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

    console.log("Database is seeded.");
  } catch (err) {
    console.error(err);
  }
}
