import React from 'react';
import { useCart } from '../context/CartContext';

const PaymentInfo = () => {
  const { cartItems } = useCart();

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax rate
    return (subtotal + tax).toFixed(2);
  };

  // Generate QR code URLs (these are example URLs, replace with your actual payment links)
  const zelleQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=zelle:yourbusiness@email.com?amount=${calculateTotal()}`;
  const cashAppQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=cashapp://yourcashtag?amount=${calculateTotal()}`;

  return (
    <div className="payment-info">
      <div className="payment-methods">
        <div className="payment-method">
          <h3>Zelle Payment</h3>
          <div className="payment-instructions">
            <p>1. Open your bank's mobile app</p>
            <p>2. Select "Send Money with Zelle"</p>
            <p>3. Enter the following details:</p>
            <div className="payment-details">
              <p><strong>Email:</strong> yourbusiness@email.com</p>
              <p><strong>Amount:</strong> ${calculateTotal()}</p>
            </div>
            <p>4. Add your order number in the memo field</p>
          </div>
          <div className="qr-code-container">
            <img src={zelleQRCode} alt="Zelle QR Code" className="qr-code" />
            <p className="qr-code-label">Scan to pay with Zelle</p>
          </div>
          <a 
            href="https://www.zellepay.com/pay" 
            target="_blank" 
            rel="noopener noreferrer"
            className="payment-button"
          >
            Pay with Zelle
          </a>
        </div>

        <div className="payment-method">
          <h3>Cash App Payment</h3>
          <div className="payment-instructions">
            <p>1. Open Cash App</p>
            <p>2. Tap the "$" icon</p>
            <p>3. Enter the following details:</p>
            <div className="payment-details">
              <p><strong>Cashtag:</strong> $YourCashAppTag</p>
              <p><strong>Amount:</strong> ${calculateTotal()}</p>
            </div>
            <p>4. Add your order number in the "For" field</p>
          </div>
          <div className="qr-code-container">
            <img src={cashAppQRCode} alt="Cash App QR Code" className="qr-code" />
            <p className="qr-code-label">Scan to pay with Cash App</p>
          </div>
          <a 
            href="https://cash.app/yourcashtag" 
            target="_blank" 
            rel="noopener noreferrer"
            className="payment-button"
          >
            Pay with Cash App
          </a>
        </div>
      </div>

      <div className="payment-note">
        <h4>Important Payment Instructions:</h4>
        <ul>
          <li>Please complete your payment before proceeding to the next step</li>
          <li>Include your order number in the payment memo/note</li>
          <li>Your order will be processed once payment is confirmed</li>
          <li>Payment confirmation may take up to 24 hours</li>
          <li>If you encounter any issues, please contact us at support@yourbusiness.com</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentInfo; 