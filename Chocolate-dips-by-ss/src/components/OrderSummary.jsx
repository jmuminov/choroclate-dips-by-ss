import React from 'react';
import { useCart } from '../context/CartContext';

const OrderSummary = () => {
  const { cartItems } = useCart();

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <div className="order-items">
        {cartItems.map((item) => (
          <div key={item.id} className="order-item">
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">x {item.quantity}</span>
            </div>
            <div className="item-price">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="order-totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Tax (8%):</span>
          <span>${calculateTax().toFixed(2)}</span>
        </div>
        <div className="total-row grand-total">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 