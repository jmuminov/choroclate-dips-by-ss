import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function NavBar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-links-left">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/menu" className="nav-link">Menu</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
      <div className="nav-links-right">
        {user ? (
          <div 
            className="user-dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span className="nav-link user-welcome">
              Welcome, {user.firstname}
              <span className="dropdown-indicator">▼</span>
            </span>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={logout} className="dropdown-item">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-link user-welcome">Login</Link>
        )}
        <Link to="/cart" className="nav-link">
          Cart
          <span className="cart-count">{cartItems.length}</span>
        </Link>
      </div>
    </nav>
  );
}