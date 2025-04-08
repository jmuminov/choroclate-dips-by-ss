import { Link } from "react-router-dom";

export default function NavBar() {
  console.log("NavBar rendered");
  return (
    <nav className="navbar">
      <div className="nav-links-left">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/menu" className="nav-link">Menu</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
      <div className="nav-links-right">
        <Link to="/cart" className="nav-link">Cart</Link>
      </div>
    </nav>
  );
}