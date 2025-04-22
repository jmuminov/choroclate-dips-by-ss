const { query } = require(".");

async function runMigrations() {
  try {
    // Add new columns to orders table
    await query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS selected_date DATE,
      ADD COLUMN IF NOT EXISTS selected_time TIME,
      ADD COLUMN IF NOT EXISTS special_requests TEXT,
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
    `);

    // Create unavailable_dates table
    await query(`
      CREATE TABLE IF NOT EXISTS unavailable_dates (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL UNIQUE,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Migrations completed successfully");
  } catch (err) {
    console.error("Error running migrations:", err);
    throw err;
  }
}

module.exports = { runMigrations }; 