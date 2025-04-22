import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import DatePicker from './DatePicker';
import OrderSummary from './OrderSummary';
import PaymentInfo from './PaymentInfo';
import OrderReview from './OrderReview';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(2);
  };

  const handleSpecialRequestsChange = (e) => {
    setSpecialRequests(e.target.value);
  };

  const handleProceedToReview = () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items: cartItems,
        selectedDate,
        specialRequests,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        clearCart();
        navigate('/order-confirmation');
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span>1</span>
          <p>Select Date</p>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span>2</span>
          <p>Payment Info</p>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span>3</span>
          <p>Review Order</p>
        </div>
      </div>

      {step === 1 && (
        <div className="checkout-step">
          <h2>Select Pickup Date</h2>
          <DatePicker onSelect={handleDateSelect} />
        </div>
      )}

      {step === 2 && (
        <div className="checkout-step">
          <h2>Payment Information</h2>
          <PaymentInfo />
          <div className="form-group">
            <label htmlFor="special-requests">Special Requests (optional):</label>
            <textarea
              id="special-requests"
              value={specialRequests}
              onChange={handleSpecialRequestsChange}
              placeholder="Any special instructions for your order..."
            />
          </div>
          <button onClick={handleProceedToReview} className="proceed-button">
            Proceed to Review
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="checkout-step">
          <h2>Review Your Order</h2>
          <OrderReview
            items={cartItems}
            selectedDate={selectedDate}
            specialRequests={specialRequests}
          />
          <button onClick={handlePlaceOrder} className="place-order-button">
            Place Order
          </button>
        </div>
      )}
    </div>
  );
} 