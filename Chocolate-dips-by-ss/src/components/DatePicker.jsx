import React, { useState, useEffect } from 'react';
import { getAvailableDates } from '../services/unavailableDatesService';

const DatePicker = ({ onSelect }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const dates = await getAvailableDates();
        setAvailableDates(dates);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAvailableDates();
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    onSelect(date);
  };

  if (loading) return <div>Loading available dates...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="date-picker-form">
      <div className="form-group">
        <label htmlFor="date">Select Date:</label>
        <select
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          required
        >
          <option value="">Select a date</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DatePicker; 