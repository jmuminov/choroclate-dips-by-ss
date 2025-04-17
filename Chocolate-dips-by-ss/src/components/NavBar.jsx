import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-links-left">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/menu" className="nav-link">Menu</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        {!user && <Link to="/login" className="nav-link">Login</Link>}
      </div>
      <div className="nav-links-right">
        {user ? (
          <>
            <span className="nav-link">Welcome, {user.fullname}</span>
            <button onClick={logout} className="nav-link logout-button">Logout</button>
          </>
        ) : null}
        <Link to="/cart" className="nav-link">
          Cart
          <span className="cart-count">{cartItems.length}</span>
        </Link>
      </div>
    </nav>
  );
}