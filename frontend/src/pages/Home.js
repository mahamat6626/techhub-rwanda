import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import API_BASE from '../config';

const CAT_ICONS = { 1: '📱', 2: '💻', 3: '🎧', 4: '📺', 5: '🔌' };

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/products`).then(r => setFeatured(r.data.slice(0, 8))).catch(console.error);
    axios.get(`${API_BASE}/api/products/categories/all`).then(r => setCategories(r.data)).catch(console.error);
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            🇷🇼 Kigali's Premier Electronics Store
          </div>

          <h1 className="hero-title">
            The Future of Tech
            <span className="hero-title-line2">Starts in Rwanda</span>
          </h1>

          <p className="hero-sub">
            Discover the latest smartphones, laptops, TVs and accessories.<br />
            Genuine products. Unbeatable prices. Delivered in 24h across Kigali.
          </p>

          <div className="hero-ctas">
            <Link to="/shop" className="btn-hero-main">
              <span>🛍️ Shop Now</span>
              <span>→</span>
            </Link>
            <Link to="/shop?category=2" className="btn-hero-ghost">
              💻 Browse Laptops
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">20+</span>
            <span className="hero-stat-label">Products</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">5</span>
            <span className="hero-stat-label">Categories</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">24h</span>
            <span className="hero-stat-label">Delivery</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">100%</span>
            <span className="hero-stat-label">Genuine</span>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section section-white">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-label">Browse</div>
            <h2 className="sec-title">Shop by <span>Category</span></h2>
          </div>
          <div className="cats-grid">
            {categories.map(cat => (
              <Link to={`/shop?category=${cat.id}`} key={cat.id} className="cat-card">
                <span className="cat-icon">{CAT_ICONS[cat.id] || '📦'}</span>
                <p className="cat-name">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="section section-off">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-label">Handpicked</div>
            <h2 className="sec-title">Featured <span>Products</span></h2>
          </div>
          <div className="prod-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="view-all-wrap">
            <Link to="/shop" className="btn-view-all">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <div style={{ padding: '0 0 80px' }}>
        <div className="promo-banner">
          <div className="promo-text">
            <div className="promo-label">🔥 Limited Time</div>
            <h2 className="promo-title">Free Delivery on <span>All Orders</span></h2>
            <p className="promo-sub">Now through end of month across all of Kigali</p>
          </div>
          <div className="promo-action">
            <Link to="/shop" className="btn-hero-main">
              <span>Grab a Deal</span><span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── WHY US ── */}
      <section className="section section-white">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-label">Why TechHub</div>
            <h2 className="sec-title">Built for <span>Rwanda</span></h2>
          </div>
          <div className="feats-grid">
            {[
              { icon: '🚚', title: 'Same-Day Delivery', desc: 'Order before 2pm, get it today anywhere in Kigali.' },
              { icon: '✅', title: '100% Genuine', desc: 'Every product verified and sourced from official distributors.' },
              { icon: '💰', title: 'Best RWF Prices', desc: 'Price-matched against all major Kigali retailers. Always.' },
              { icon: '🔧', title: 'Full Warranty', desc: '12-month warranty and dedicated after-sale technical support.' },
            ].map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-icon-wrap"><span>{f.icon}</span></div>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: 16 }}>⚡</div>
              TechHub Rwanda
            </div>
            <div className="footer-links">
              <Link to="/home" className="footer-link">Home</Link>
              <Link to="/shop" className="footer-link">Shop</Link>
              <Link to="/deals" className="footer-link">Deals</Link>
              <Link to="/track" className="footer-link">Track Order</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/cart" className="footer-link">Cart</Link>
            </div>
          </div>
          <p className="footer-copy">© 2026 TechHub Rwanda · All rights reserved · Kigali, Rwanda 🇷🇼</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
