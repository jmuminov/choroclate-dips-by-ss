import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch cart items when user logs in
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cart/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      // Redirect to login or show login prompt
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity,
          user_id: user.id
        })
      });

      if (response.ok) {
        const newItem = await response.json();
        setCartItems([...cartItems, newItem]);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add item to cart' };
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    if (!user) return { success: false, message: 'Please login to update cart' };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setCartItems(cartItems.map(item => 
          item.id === cartItemId ? updatedItem : item
        ));
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { success: false, message: 'Failed to update cart item' };
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user) return { success: false, message: 'Please login to remove from cart' };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCartItems(cartItems.filter(item => item.id !== cartItemId));
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'Failed to remove item from cart' };
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      loading, 
      addToCart, 
      updateCartItem, 
      removeFromCart,
      fetchCartItems,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 