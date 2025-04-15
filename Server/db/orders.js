import { query } from ".";

// Fetch all orders for a user
async function getAllOrders(userId) {
  try {
    const res = await query("SELECT * FROM orders WHERE user_id = $1;", [
      userId,
    ]);
    return res.rows;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching orders.");
  }
}

// Fetch an order by ID
async function getOrderById(userId, orderId) {
  try {
    const res = await query(
      "SELECT * FROM orders WHERE user_id = $1 AND id = $2;",
      [userId, orderId]
    );
    if (res.rows.length === 0) {
      throw new Error("Order not found.");
    }
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching order.");
  }
}
// Fetch all orders
async function getAllOrders() {
  try {
    const res = await query("SELECT * FROM orders;", []);
    return res.rows;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching orders.");
  }
}
// Fetch an order by ID
async function getOrderById(id) {
  try {
    const res = await query("SELECT * FROM orders WHERE id = $1;", [id], []);
    if (res.rows.length === 0) {
      throw new Error("Order not found.");
    }
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching order.");
  }
}

// Create a new order
async function createOrder(order) {
  try {
    const res = await query(
      "INSERT INTO orders (order_number, user_id, product_id, quantity) VALUES ($1, $2, $3, $4) RETURNING *;",
      [order.order_number, order.user_id, order.product_id, order.quantity],
      []
    );
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error creating order.");
  }
}
// Update an order by ID
async function updateOrderById(id, order) {
  try {
    const res = await query(
      "UPDATE orders SET order_number = $1, user_id = $2, product_id = $3, quantity = $4 WHERE id = $5 RETURNING *;",
      [order.order_number, order.user_id, order.product_id, order.quantity, id],
      []
    );
    if (res.rows.length === 0) {
      throw new Error("Order not found.");
    }
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error updating order.");
  }
}
// Delete an order by ID
async function deleteOrderById(id) {
  try {
    const res = await query(
      "DELETE FROM orders WHERE id = $1 RETURNING *;",
      [id],
      []
    );
    if (res.rows.length === 0) {
      throw new Error("Order not found.");
    }
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error deleting order.");
  }
}
// Export functions
export {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
};
