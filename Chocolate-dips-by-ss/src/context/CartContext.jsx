import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getGuestCart, saveGuestCart, clearGuestCart } from '../utils/guestCart';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Initialize cart based on user state
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      // Load guest cart
      const guestCart = getGuestCart();
      setCartItems(guestCart);
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
        const cartData = await response.json();
        
        // Fetch product details for each cart item
        const cartItemsWithProducts = await Promise.all(
          cartData.map(async (item) => {
            const productResponse = await fetch(`/api/products/${item.product_id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (productResponse.ok) {
              const product = await productResponse.json();
              return {
                ...item,
                name: product.name,
                price: product.price,
                image: product.image
              };
            }
            return item;
          })
        );
        
        setCartItems(cartItemsWithProducts);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (user) {
        // Add to user's cart in database
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
          
          // Fetch product details for the new cart item
          const productResponse = await fetch(`/api/products/${productId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (productResponse.ok) {
            const product = await productResponse.json();
            const cartItemWithProduct = {
              ...newItem,
              name: product.name,
              price: product.price,
              image: product.image
            };
            
            setCartItems([...cartItems, cartItemWithProduct]);
            return { success: true };
          }
        }
      } else {
        // Add to guest cart
        const productResponse = await fetch(`/api/products/${productId}`);
        if (productResponse.ok) {
          const product = await productResponse.json();
          const newItem = {
            id: `guest-${Date.now()}`,
            product_id: productId,
            quantity,
            name: product.name,
            price: product.price,
            image: product.image
          };
          
          const updatedCart = [...cartItems, newItem];
          setCartItems(updatedCart);
          saveGuestCart(updatedCart);
          return { success: true };
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add item to cart' };
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      if (user) {
        // Update user's cart in database
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
          const existingItem = cartItems.find(item => item.id === cartItemId);
          const updatedItemWithProduct = {
            ...updatedItem,
            name: existingItem.name,
            price: existingItem.price,
            image: existingItem.image
          };
          
          setCartItems(cartItems.map(item => 
            item.id === cartItemId ? updatedItemWithProduct : item
          ));
          return { success: true };
        }
      } else {
        // Update guest cart
        const updatedCart = cartItems.map(item => 
          item.id === cartItemId ? { ...item, quantity } : item
        );
        setCartItems(updatedCart);
        saveGuestCart(updatedCart);
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { success: false, message: 'Failed to update cart item' };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      if (user) {
        // Remove from user's cart in database
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
        }
      } else {
        // Remove from guest cart
        const updatedCart = cartItems.filter(item => item.id !== cartItemId);
        setCartItems(updatedCart);
        saveGuestCart(updatedCart);
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'Failed to remove item from cart' };
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (!user) {
      clearGuestCart();
    }
  };

  // Function to merge guest cart with user cart
  const mergeGuestCartWithUser = async (userId) => {
    if (!userId) return;

    const guestCart = getGuestCart();
    if (guestCart.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      
      // Add each guest cart item to the user's cart
      for (const item of guestCart) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            product_id: item.product_id,
            quantity: item.quantity,
            user_id: userId
          })
        });
      }

      // Clear guest cart and fetch updated user cart
      clearGuestCart();
      await fetchCartItems();
    } catch (error) {
      console.error('Error merging guest cart with user cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      loading, 
      addToCart, 
      updateCartItem, 
      removeFromCart,
      fetchCartItems,
      clearCart,
      mergeGuestCartWithUser
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