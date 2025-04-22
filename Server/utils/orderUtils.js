function generateOrderNumber() {
  const prefix = 'ORD';
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${prefix}-${dateStr}-${randomNum}`;
}

module.exports = {
  generateOrderNumber
}; 