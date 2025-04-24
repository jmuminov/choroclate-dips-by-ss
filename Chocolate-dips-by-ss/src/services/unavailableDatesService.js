// const API_URL = 'http://localhost:3000/api/unavailable-dates';
const API_URL = 'https://choroclate-dips-by-ss.onrender.com/api/unavailable-dates';

export const getUnavailableDates = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch unavailable dates');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching unavailable dates:', error);
    throw error;
  }
};

export const getAvailableDates = async () => {
  try {
    const response = await fetch(`${API_URL}/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available dates');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching available dates:', error);
    throw error;
  }
};

export const addUnavailableDate = async (dateData, token) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dateData)
    });

    if (!response.ok) {
      throw new Error('Failed to add unavailable date');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding unavailable date:', error);
    throw error;
  }
};

export const deleteUnavailableDate = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete unavailable date');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting unavailable date:', error);
    throw error;
  }
}; 