import { query } from ".";

// Fetch all products
async function getAllProducts() {
  try {
    const res = await query("SELECT * FROM products;", []);
    return res.rows;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching products.");
  }
}

// Fetch a product by ID
async function getProductById(id) {
  try {
    const res = await query("SELECT * FROM products WHERE id = $1;", [id], []);
    if (res.rows.length === 0) {
      throw new Error("Product not found.");
    }
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching product.");
  }
}

// Create a new product
async function createProduct(product) {
  try {
    const res = await query(
      "INSERT INTO products (name, price, description, image) VALUES ($1, $2, $3, $4) RETURNING *;",
      [product.name, product.price, product.description, product.image],
      []
    );
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error creating product.");
  }
}
// Update a product
async function updateProduct(id, product) {
  try {
    const res = await query(
      "UPDATE products SET name = $1, price = $2, description = $3, image = $4 WHERE id = $5 RETURNING *;",
      [product.name, product.price, product.description, product.image, id],
      []
    );
    if (res.rows.length === 0) {
      throw new Error("Product not found.");
    }
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error updating product.");
  }
}
// Delete a product
async function deleteProduct(id) {
  try {
    const res = await query(
      "DELETE FROM products WHERE id = $1 RETURNING *;",
      [id],
      []
    );
    if (res.rows.length === 0) {
      throw new Error("Product not found.");
    }
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error deleting product.");
  }
}
// Export functions
export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
