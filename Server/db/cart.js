import { query } from ".";

// Get all cart items for a user
async function getCartItems(userId) {
  try {
    const res = await query("SELECT * FROM cart WHERE user_id = $1;", [
      userId,
    ]);
    return res.rows;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching cart items.");
  }
}

// Add an item to the cart
async function addItemToCart(item) {
  try {
    const res = await query(
      "INSERT INTO cart (product_id, quantity, user_id) VALUES ($1, $2, $3) RETURNING *;",
      [item.product_id, item.quantity, item.user_id]
    );
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error adding item to cart.");
  }
}
// Update an item in the cart
async function updateCartItem(id, quantity) {
  try {
    const res = await query(
      "UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *;",
      [quantity, id]
    );
    if (res.rows.length === 0) {
      throw new Error("Cart item not found.");
    }
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error updating cart item.");
  }
}
// Delete an item from the cart
async function deleteCartItem(id) {
  try {
    const res = await query("DELETE FROM cart WHERE id = $1 RETURNING *;", [
      id,
    ]);
    if (res.rows.length === 0) {
      throw new Error("Cart item not found.");
    }
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error deleting cart item.");
  }
}
// Export functions
export {
  getCartItems,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
};