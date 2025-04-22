import React, { useState, useEffect } from 'react';
import { getUnavailableDates, addUnavailableDate, deleteUnavailableDate } from '../services/unavailableDatesService';
import '../styles/UnavailableDates.css';

const UnavailableDates = ({ token }) => {
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState({
    date: '',
    end_date: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    try {
      const data = await getUnavailableDates();
      setDates(data);
    } catch (error) {
      console.error('Error fetching unavailable dates:', error);
      setError('Failed to fetch unavailable dates');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await addUnavailableDate(newDate, token);
      setSuccess('Date added successfully');
      setNewDate({ date: '', end_date: '', reason: '' });
      fetchDates();
    } catch (error) {
      console.error('Error adding date:', error);
      setError('Failed to add date');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUnavailableDate(id, token);
      setSuccess('Date deleted successfully');
      fetchDates();
    } catch (error) {
      console.error('Error deleting date:', error);
      setError('Failed to delete date');
    }
  };

  return (
    <div className="unavailable-dates-container">
      <h2>Manage Unavailable Dates</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="date-form">
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="date"
            value={newDate.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date (optional):</label>
          <input
            type="date"
            name="end_date"
            value={newDate.end_date}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Reason:</label>
          <input
            type="text"
            name="reason"
            value={newDate.reason}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Add Date</button>
      </form>

      <div className="dates-list">
        <h3>Current Unavailable Dates</h3>
        {dates.length === 0 ? (
          <p>No unavailable dates set</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dates.map(date => (
                <tr key={date.id}>
                  <td>{new Date(date.date).toLocaleDateString()}</td>
                  <td>{date.end_date ? new Date(date.end_date).toLocaleDateString() : '-'}</td>
                  <td>{date.reason}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(date.id)}
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
};

export default UnavailableDates; 