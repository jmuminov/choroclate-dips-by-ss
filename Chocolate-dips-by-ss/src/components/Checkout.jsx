import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DatePickerComponent from './DatePicker';
import OrderSummary from './OrderSummary';
import PaymentInfo from './PaymentInfo';
import OrderReview from './OrderReview';

const API_URL = 'https://choroclate-dips-by-ss.onrender.com';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
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
      // Clean up user ID - remove 'guest-' prefix if present
      const cleanUserId = user ? (user.id.toString().startsWith('guest-') ? null : parseInt(user.id)) : null;

      const orderData = {
        items: cartItems,
        selectedDate,
        specialRequests,
        user_id: cleanUserId,
        userEmail: user ? user.email : null
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        navigate('/order-confirmation', { state: { orderNumber: data.orderNumber } });
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
          <DatePickerComponent 
            onSelect={handleDateSelect}
            onNext={() => setStep(2)}
          />
        </div>
      )}

      {step === 2 && (
        <div className="checkout-step">
          <h2>Payment Information</h2>
          <PaymentInfo />
          <button onClick={handleProceedToReview} className="proceed-button">
            Proceed to Review
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="checkout-step">
          <h2>Review Your Order</h2>
          <OrderReview
            selectedDate={selectedDate}
            specialRequests={specialRequests}
            onSpecialRequestsChange={handleSpecialRequestsChange}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      )}
    </div>
  );
} 