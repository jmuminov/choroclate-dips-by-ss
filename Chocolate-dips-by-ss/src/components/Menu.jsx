import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Menu.css';

function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching products...');
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products fetched successfully:', data);
      setProducts(data);
      
      // Initialize quantities for all products
      const initialQuantities = {};
      data.forEach(product => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error details:', error);
      setError(`Error fetching products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, value) => {
    const newValue = Math.max(1, Math.min(99, parseInt(value) || 1));
    setQuantities(prev => ({
      ...prev,
      [productId]: newValue
    }));
  };

  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId];
    const result = await addToCart(productId, quantity);
    
    if (!result.success) {
      alert(result.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="menu-container">
      <h1>Our Menu</h1>
      <div className="menu-grid">
        {products.map((product) => (
          <div key={product.id} className="menu-item-container">
            <div className="menu-item">
              <img 
                src={product.image} 
                alt={product.name} 
                className="menu-item-image"
              />
              <div className="menu-item-details">
                <h3>{product.name}</h3>
                <p className="menu-item-description">{product.description}</p>
                <p className="menu-item-price">${Number(product.price).toFixed(2)}</p>
              </div>
            </div>
            <div className="menu-item-quantity">
              <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${product.id}`}
                className="menu-item-quantity-input"
                min="1"
                max="99"
                value={quantities[product.id] || 1}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
              />
            </div>
            <button 
              className="add-to-cart-button"
              onClick={() => handleAddToCart(product.id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
