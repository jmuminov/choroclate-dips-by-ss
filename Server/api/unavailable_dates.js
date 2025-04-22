const express = require('express');
const router = express.Router();
const db = require('../db');
const { format, addDays, isWithinInterval, parseISO } = require('date-fns');
const jwt = require('jsonwebtoken');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add your admin check logic here
    // For now, we'll just proceed
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all unavailable dates
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM unavailable_dates ORDER BY date');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching unavailable dates:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new unavailable date(s)
router.post('/', isAdmin, async (req, res) => {
  const { date, is_range, end_date } = req.body;

  try {
    if (is_range && !end_date) {
      return res.status(400).json({ message: 'End date required for date range' });
    }

    const result = await db.query(
      'INSERT INTO unavailable_dates (date, is_range, end_date) VALUES ($1, $2, $3) RETURNING *',
      [date, is_range, end_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding unavailable date:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete unavailable date
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM unavailable_dates WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Date not found' });
    }

    res.json({ message: 'Date deleted successfully' });
  } catch (err) {
    console.error('Error deleting unavailable date:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available dates for next 30 days
router.get('/available', async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);

    // Get all unavailable dates
    const unavailableResult = await db.query('SELECT * FROM unavailable_dates');
    const unavailableDates = unavailableResult.rows;

    // Generate all dates for next 30 days
    const allDates = [];
    let currentDate = today;
    while (currentDate <= thirtyDaysFromNow) {
      allDates.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate = addDays(currentDate, 1);
    }

    // Filter out unavailable dates
    const availableDates = allDates.filter(date => {
      return !unavailableDates.some(unavailable => {
        if (unavailable.is_range) {
          const startDate = parseISO(unavailable.date);
          const endDate = parseISO(unavailable.end_date);
          const currentDate = parseISO(date);
          return isWithinInterval(currentDate, { start: startDate, end: endDate });
        }
        return date === format(parseISO(unavailable.date), 'yyyy-MM-dd');
      });
    });

    res.json(availableDates);
  } catch (err) {
    console.error('Error fetching available dates:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 