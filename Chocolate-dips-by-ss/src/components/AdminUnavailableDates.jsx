import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/AdminUnavailableDates.css';

export default function AdminUnavailableDates() {
  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isRange, setIsRange] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchUnavailableDates();
  }, []);

  const fetchUnavailableDates = async () => {
    try {
      const response = await fetch('/api/unavailable-dates');
      if (response.ok) {
        const data = await response.json();
        setDates(data);
      } else if (response.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to fetch unavailable dates');
      }
    } catch (err) {
      console.error('Error fetching unavailable dates:', err);
      setError('Failed to fetch unavailable dates');
    }
  };

  const handleAddDate = async (e) => {
    e.preventDefault();
    if (!startDate) {
      setError('Please select a date');
      return;
    }

    if (isRange && !endDate) {
      setError('Please select an end date for the range');
      return;
    }

    try {
      const response = await fetch('/api/unavailable-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date: startDate.toISOString().split('T')[0],
          end_date: isRange ? endDate.toISOString().split('T')[0] : null,
          is_range: isRange,
          reason
        }),
      });

      if (response.ok) {
        const newDateData = await response.json();
        setDates([...dates, newDateData]);
        setStartDate(null);
        setEndDate(null);
        setReason('');
        setError('');
      } else if (response.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to add date');
      }
    } catch (err) {
      console.error('Error adding unavailable date:', err);
      setError('Failed to add date');
    }
  };

  const handleDeleteDate = async (id) => {
    try {
      const response = await fetch(`/api/unavailable-dates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setDates(dates.filter(date => date.id !== id));
      } else if (response.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to delete date');
      }
    } catch (err) {
      console.error('Error deleting unavailable date:', err);
      setError('Failed to delete date');
    }
  };

  if (!user) {
    return <div className="error-message">Please log in to access this page</div>;
  }

  if (!user.isAdmin) {
    return <div className="error-message">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="admin-unavailable-dates">
      <h2>Manage Unavailable Dates</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleAddDate} className="add-date-form">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isRange}
              onChange={(e) => {
                setIsRange(e.target.checked);
                if (!e.target.checked) {
                  setEndDate(null);
                }
              }}
            />
            Add Date Range
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            className="date-picker-input"
            placeholderText="Select start date"
            required
          />
        </div>

        {isRange && (
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={startDate}
              className="date-picker-input"
              placeholderText="Select end date"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="reason">Reason (optional):</label>
          <input
            type="text"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for unavailability"
          />
        </div>
        <button type="submit" className="add-button">Add Date</button>
      </form>

      <div className="dates-list">
        <h3>Unavailable Dates</h3>
        {dates.length === 0 ? (
          <p>No unavailable dates set</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dates.map(date => (
                <tr key={date.id}>
                  <td>
                    {date.is_range 
                      ? `${new Date(date.date).toLocaleDateString()} - ${new Date(date.end_date).toLocaleDateString()}`
                      : new Date(date.date).toLocaleDateString()}
                  </td>
                  <td>{date.reason || 'No reason provided'}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteDate(date.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 