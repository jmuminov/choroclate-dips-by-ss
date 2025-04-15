export default function Cart() {
  console.log("Cart rendered");

  // Example cart items
  const cartItems = [
    {
      id: 1,
      name: "Chocolate Strawberry",
      price: 5.99,
      image: "/images/strawberry.jpg",
      quantity: 2,
    },
    {
      id: 2,
      name: "Chocolate Banana",
      price: 4.99,
      image: "/images/banana.jpg",
      quantity: 1,
    },
  ];

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      {/* Header */}
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <h3>Price</h3>
      </div>
      <hr />

      {/* Cart Items */}
      {cartItems.map((item, index) => (
        <div key={item.id}>
          <div className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <p className="cart-item-name">{item.name}</p>
              <div className="cart-item-quantity">
                <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                <input
                  type="number"
                  id={`quantity-${item.id}`}
                  name={`quantity-${item.id}`}
                  value={item.quantity}
                  min="1"
                  className="cart-item-input"
                />
              </div>
              <button className="cart-item-remove">Remove</button>
            </div>
            <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          {/* Divider after each item */}
          {index < cartItems.length - 1 && <hr />}
        </div>
      ))}
      <hr />

      {/* Total Price and Checkout */}
      <div className="cart-total">
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
        <button className="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  );
}