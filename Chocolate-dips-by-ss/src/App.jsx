import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contact';
import About from './components/About';
import AdminUnavailableDates from './components/AdminUnavailableDates';
import './styles/App.css';
import './styles/Checkout.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/unavailable-dates" element={<AdminUnavailableDates />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
