import { Link } from "react-router-dom";

export default function NavBar() {
  console.log("NavBar rendered");
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/menu" className="nav-link">Menu</Link>
      <Link to="/about" className="nav-link">About</Link>
      <Link to="/contact" className="nav-link">Contact</Link>
      <Link to="/cart" className="nav-link">Cart</Link>
    </nav>
  );
}