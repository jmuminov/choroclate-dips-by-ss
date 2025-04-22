import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminUnavailableDates() {
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState('');
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
      }
    } catch (err) {
      console.error('Error fetching unavailable dates:', err);
      setError('Failed to fetch unavailable dates');
    }
  };

  const handleAddDate = async (e) => {
    e.preventDefault();
    if (!newDate) {
      setError('Please select a date');
      return;
    }

    try {
      const response = await fetch('/api/unavailable-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: newDate, reason }),
      });

      if (response.ok) {
        const newDate = await response.json();
        setDates([...dates, newDate]);
        setNewDate('');
        setReason('');
        setError('');
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
      });

      if (response.ok) {
        setDates(dates.filter(date => date.id !== id));
      } else {
        setError('Failed to delete date');
      }
    } catch (err) {
      console.error('Error deleting unavailable date:', err);
      setError('Failed to delete date');
    }
  };

  if (!user) {
    return <div>Please log in to access this page</div>;
  }

  return (
    <div className="admin-unavailable-dates">
      <h2>Manage Unavailable Dates</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleAddDate} className="add-date-form">
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />
        </div>
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
                  <td>{new Date(date.date).toLocaleDateString()}</td>
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