import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OrderReview = ({ selectedDate, specialRequests, onSpecialRequestsChange, onPlaceOrder }) => {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePlaceOrder = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    onPlaceOrder();
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: '/checkout' } });
  };

  return (
    <div className="order-review">
      {showLoginPrompt && (
        <div className="login-prompt-overlay">
          <div className="login-prompt">
            <h3>Login Required</h3>
            <p>Please login or create an account to place your order.</p>
            <div className="login-prompt-buttons">
              <button onClick={handleLoginRedirect} className="login-button">
                Login / Create Account
              </button>
              <button onClick={() => setShowLoginPrompt(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="review-section">
        <h3>Pickup Details</h3>
        <div className="pickup-info">
          <p><strong>Date:</strong> {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
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

      <div className="review-section">
        <h3>Special Requests</h3>
        <div className="form-group">
          <textarea
            id="special-requests"
            value={specialRequests}
            onChange={onSpecialRequestsChange}
            placeholder="Any special instructions for your order..."
            className="special-requests-input"
          />
        </div>
      </div>

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

      <button onClick={handlePlaceOrder} className="place-order-button">
        Place Order
      </button>
    </div>
  );
};

export default OrderReview; 