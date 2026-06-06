import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = path => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/home" className="navbar-logo">
          <div className="navbar-logo-icon">⚡</div>
          TechHub <span>Rwanda</span>
        </Link>

        <div className="navbar-links">
          <Link to="/home"    className={`navbar-link${isActive('/home')    ? ' navbar-link-active' : ''}`}>Home</Link>
          <Link to="/shop"    className={`navbar-link${isActive('/shop')    ? ' navbar-link-active' : ''}`}>Shop</Link>
          <Link to="/deals"   className={`navbar-link navbar-link-deals${isActive('/deals')   ? ' navbar-link-active' : ''}`}>
            🔥 Deals
          </Link>
          <Link to="/track"   className={`navbar-link${isActive('/track')   ? ' navbar-link-active' : ''}`}>Track Order</Link>
          <Link to="/contact" className={`navbar-link${isActive('/contact') ? ' navbar-link-active' : ''}`}>Contact</Link>
          <Link to="/cart" className="navbar-cart">
            🛒 Cart
            {totalItems > 0 && <span className="navbar-badge">{totalItems}</span>}
          </Link>
        </div>

        <button className="navbar-menu-btn" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="navbar-mobile">
          <Link to="/home"    className="navbar-mobile-link" onClick={() => setOpen(false)}>🏠 Home</Link>
          <Link to="/shop"    className="navbar-mobile-link" onClick={() => setOpen(false)}>🛍️ Shop</Link>
          <Link to="/deals"   className="navbar-mobile-link" onClick={() => setOpen(false)}>🔥 Deals & Offers</Link>
          <Link to="/track"   className="navbar-mobile-link" onClick={() => setOpen(false)}>📦 Track Order</Link>
          <Link to="/contact" className="navbar-mobile-link" onClick={() => setOpen(false)}>📞 Contact Us</Link>
          <Link to="/cart"    className="navbar-mobile-link" onClick={() => setOpen(false)}>
            🛒 Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
