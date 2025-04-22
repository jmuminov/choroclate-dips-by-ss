import React, { useState } from 'react';

const PaymentInfo = () => {
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  return (
    <div className="payment-info">
      <h2>Payment Information</h2>
      <form className="payment-form">
        <div className="form-group">
          <label htmlFor="nameOnCard">Name on Card</label>
          <input
            type="text"
            id="nameOnCard"
            name="nameOnCard"
            value={paymentInfo.nameOnCard}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formatCardNumber(paymentInfo.cardNumber)}
            onChange={handleChange}
            maxLength="19"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formatExpiryDate(paymentInfo.expiryDate)}
              onChange={handleChange}
              maxLength="5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={paymentInfo.cvv}
              onChange={handleChange}
              maxLength="4"
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentInfo; 