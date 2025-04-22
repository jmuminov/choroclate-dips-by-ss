import React from 'react';
import { useCart } from '../context/CartContext';

const OrderReview = ({ selectedDate, selectedTime, specialRequests }) => {
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
    <div className="order-review">
      <h2>Review Your Order</h2>
      
      <div className="review-section">
        <h3>Pickup Details</h3>
        <div className="pickup-info">
          <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
        </div>
      </div>

      <div className="review-section">
        <h3>Order Items</h3>
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
      </div>

      {specialRequests && (
        <div className="review-section">
          <h3>Special Requests</h3>
          <p className="special-requests">{specialRequests}</p>
        </div>
      )}

      <div className="review-section">
        <h3>Order Total</h3>
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
    </div>
  );
};

export default OrderReview; 