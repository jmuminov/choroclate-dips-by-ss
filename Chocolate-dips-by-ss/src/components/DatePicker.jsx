import React, { useState, useEffect } from 'react';
import { getAvailableDates } from '../services/unavailableDatesService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/Checkout.css';

const DatePickerComponent = ({ onSelect, onNext }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const dates = await getAvailableDates();
        // Convert available dates to a Set for faster lookup
        const availableDatesSet = new Set(dates);
        
        // Generate all dates for next 60 days
        const today = new Date();
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(today.getDate() + 60);
        
        const allDates = [];
        let currentDate = new Date(today);
        
        while (currentDate <= sixtyDaysFromNow) {
          const dateStr = currentDate.toISOString().split('T')[0];
          if (!availableDatesSet.has(dateStr)) {
            allDates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setUnavailableDates(allDates);
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchAvailableDates:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAvailableDates();
  }, []);

  const handleDateChange = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setError(null);
  };

  const handleNext = () => {
    if (!selectedDate) {
      setError('Please select a date before proceeding');
      return;
    }
    setError(null);
    onSelect(selectedDate.toISOString().split('T')[0]);
    onNext();
  };

  const isDateUnavailable = (date) => {
    if (!date) return false;
    return unavailableDates.some(unavailableDate => 
      date.toDateString() === unavailableDate.toDateString()
    );
  };

  if (loading) return <div>Loading available dates...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="date-picker-form">
      <div className="form-group">
        <label htmlFor="date">Select Date:</label>
        <DatePicker
          id="date"
          selected={selectedDate}
          onChange={handleDateChange}
          filterDate={date => !isDateUnavailable(date)}
          minDate={new Date()}
          maxDate={new Date(new Date().setDate(new Date().getDate() + 60))}
          dateFormat="MMMM d, yyyy"
          className="date-picker-input"
          placeholderText="Select a date"
          required
          autoComplete="off"
        />
      </div>
      <div className="error-container">
        {error && <div className="error-message" role="alert">{error}</div>}
      </div>
      <div className="form-group">
        <button 
          onClick={handleNext}
          className={`add-button ${!selectedDate ? 'disabled' : ''}`}
          disabled={!selectedDate}
          title={!selectedDate ? "Please select a date" : ""}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DatePickerComponent; 