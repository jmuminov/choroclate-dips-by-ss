const db = require("../db");

async function seed() {
  console.log("Seeding the database.");
  try {
    // Clear the database.
    await db.query("DROP TABLE IF EXISTS cart, orders, products, user_info, users, unavailable_dates;");

    // Recreate the tables
    await db.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        );
        CREATE TABLE user_info (
          id SERIAL PRIMARY KEY,
          firstname TEXT NOT NULL,
          lastname TEXT NOT NULL,
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
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE orders (
          id SERIAL PRIMARY KEY,
          order_number TEXT NOT NULL,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL DEFAULT 1,
          order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE unavailable_dates (
          id SERIAL PRIMARY KEY,
          date DATE NOT NULL,
          is_range BOOLEAN DEFAULT FALSE,
          end_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Insert sample products
    await db.query(`
      INSERT INTO products (name, price, description, image) VALUES
      ('Chocolate Strawberry', 5.99, 'Fresh strawberries dipped in chocolate', '/images/strawberry.jpg'),
      ('Chocolate Banana', 4.99, 'Banana slices covered in chocolate', '/images/banana.jpg'),
      ('Chocolate Pretzel', 3.99, 'Crunchy pretzels dipped in chocolate', '/images/pretzel.jpg'),
      ('Chocolate Marshmallow', 2.99, 'Fluffy marshmallows covered in chocolate', '/images/marshmallow.jpg');
    `);

    // Insert sample unavailable dates
    await db.query(`
      INSERT INTO unavailable_dates (date, is_range, end_date) VALUES
      ('2024-12-25', FALSE, NULL), -- Christmas Day
      ('2024-01-01', FALSE, NULL), -- New Year's Day
      ('2024-07-04', FALSE, NULL), -- Independence Day
      ('2024-11-28', TRUE, '2024-11-30'); -- Thanksgiving weekend
    `);

    console.log("Database is seeded.");
  } catch (err) {
    console.error(err);
  }
}

module.exports = { seed };
