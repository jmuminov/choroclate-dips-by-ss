const { query } = require(".");
const bcrypt = require("bcrypt");

async function dropAllTables() {
  try {
    console.log("Dropping all tables...");
    await query(`
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS cart CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS user_info CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS unavailable_dates CASCADE;
    `);
    console.log("All tables dropped successfully");
  } catch (err) {
    console.error("Error dropping tables:", err);
    throw err;
  }
}

async function setupDatabase() {
  try {
    console.log("Starting database setup...");

    // Drop all existing tables first
    await dropAllTables();

    // Create tables if they don't exist
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS user_info (
        id SERIAL PRIMARY KEY,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        email TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        selected_date DATE,
        selected_time TIME,
        special_requests TEXT,
        status TEXT DEFAULT 'pending'
      );

      CREATE TABLE IF NOT EXISTS unavailable_dates (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        is_range BOOLEAN DEFAULT FALSE,
        end_date DATE,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, end_date)
      );
    `);

    // Add sample products if none exist
    const productsCount = await query("SELECT COUNT(*) FROM products");
    if (productsCount.rows[0].count === '0') {
      await query(`
        INSERT INTO products (name, price, description, image) VALUES
        ('Chocolate Strawberry', 5.99, 'Fresh strawberries dipped in chocolate', 'https://i.imgur.com/wxbgyED.jpeg'),
        ('Chocolate Banana', 4.99, 'Banana slices covered in chocolate', 'https://www.onelovelylife.com/wp-content/uploads/2016/07/Chocolate-Covered-Bananas10.jpg'),
        ('Chocolate Pretzel', 3.99, 'Crunchy pretzels dipped in chocolate', 'https://sugarspunrun.com/wp-content/uploads/2023/11/Chocolate-covered-Pretzels-1-of-1.jpg'),
        ('Chocolate Marshmallow', 2.99, 'Fluffy marshmallows covered in chocolate', 'https://www.allrecipes.com/thmb/BKWy4xif2Lm-lYyBlBc0DS9ZcL0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/7414662-d204fe177edd4ae8aa70bad0806422bd.jpg');
      `);
      console.log("Sample products added");
    }

    // Add sample unavailable dates if none exist
    const datesCount = await query("SELECT COUNT(*) FROM unavailable_dates");
    if (datesCount.rows[0].count === '0') {
      await query(`
        INSERT INTO unavailable_dates (date, is_range, end_date, reason) VALUES
        ('2024-12-25', FALSE, NULL, 'Christmas Day'),
        ('2024-01-01', FALSE, NULL, 'New Year''s Day'),
        ('2024-07-04', FALSE, NULL, 'Independence Day'),
        ('2024-11-28', TRUE, '2024-11-30', 'Thanksgiving Weekend');
      `);
      console.log("Sample unavailable dates added");
    }

    // Create admin user if it doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    console.log("Checking for admin user with email:", adminEmail);
    
    // Check if admin user exists
    const adminExists = await query(
      "SELECT * FROM users WHERE username = $1",
      [adminEmail]
    );

    if (adminExists.rows.length === 0) {
      console.log("Admin user not found, creating new admin user...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Create admin user
      const result = await query(
        "INSERT INTO users (username, password, is_admin) VALUES ($1, $2, TRUE) RETURNING *",
        [adminEmail, hashedPassword]
      );
      
      const adminId = result.rows[0].id;
      
      // Create admin user info
      await query(
        "INSERT INTO user_info (firstname, lastname, email, user_id) VALUES ($1, $2, $3, $4)",
        ['Admin', 'User', adminEmail, adminId]
      );
      
      console.log("Admin user and info created successfully with ID:", adminId);
    } else {
      const adminId = adminExists.rows[0].id;
      console.log("Admin user already exists with ID:", adminId);
      
      // Check if admin user info exists
      const adminInfoExists = await query(
        "SELECT * FROM user_info WHERE user_id = $1",
        [adminId]
      );
      
      if (adminInfoExists.rows.length === 0) {
        console.log("Admin user info not found, creating...");
        // Create admin user info if it doesn't exist
        await query(
          "INSERT INTO user_info (firstname, lastname, email, user_id) VALUES ($1, $2, $3, $4)",
          ['Admin', 'User', adminEmail, adminId]
        );
        console.log("Admin user info created successfully");
      } else {
        console.log("Admin user info already exists");
      }
    }

    // Verify admin user exists and is properly set up
    const verifyAdmin = await query(
      "SELECT u.*, ui.* FROM users u JOIN user_info ui ON u.id = ui.user_id WHERE u.username = $1",
      [adminEmail]
    );
    
    if (verifyAdmin.rows.length > 0) {
      console.log("Admin user verification successful:", {
        id: verifyAdmin.rows[0].id,
        username: verifyAdmin.rows[0].username,
        is_admin: verifyAdmin.rows[0].is_admin,
        firstname: verifyAdmin.rows[0].firstname,
        lastname: verifyAdmin.rows[0].lastname
      });
    } else {
      console.error("Admin user verification failed!");
    }

    console.log("Database setup completed successfully");
  } catch (err) {
    console.error("Error during database setup:", err);
    throw err;
  }
}

module.exports = { setupDatabase }; 