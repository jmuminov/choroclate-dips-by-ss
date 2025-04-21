// Guest cart storage with 30-minute expiration
const GUEST_CART_KEY = 'guest_cart';
const CART_EXPIRY_KEY = 'guest_cart_expiry';
const EXPIRY_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const saveGuestCart = (cartItems) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
  localStorage.setItem(CART_EXPIRY_KEY, JSON.stringify(Date.now() + EXPIRY_DURATION));
};

export const getGuestCart = () => {
  const expiryTime = JSON.parse(localStorage.getItem(CART_EXPIRY_KEY) || '0');
  const now = Date.now();

  if (now > expiryTime) {
    // Cart has expired, clear it
    clearGuestCart();
    return [];
  }

  return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
};

export const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
  localStorage.removeItem(CART_EXPIRY_KEY);
};

export const isGuestCartExpired = () => {
  const expiryTime = JSON.parse(localStorage.getItem(CART_EXPIRY_KEY) || '0');
  return Date.now() > expiryTime;
}; 