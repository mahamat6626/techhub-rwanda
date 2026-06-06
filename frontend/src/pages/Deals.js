import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import API_BASE from '../config';

/* Countdown to end of day */
const useCountdown = () => {
  const getTimeLeft = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    const diff = end - now;
    return {
      h: String(Math.floor(diff / 3600000)).padStart(2, '0'),
      m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
      s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
    };
  };
  const [time, setTime] = useState(getTimeLeft());
  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

/* Which products are "on deal" and their discount % */
const DEALS_CONFIG = [
  { id: 9,  discount: 80 }, { id: 10, discount: 80 },
  { id: 11, discount: 80 }, { id: 12, discount: 80 },
  { id: 30, discount: 80 }, { id: 31, discount: 80 },
  { id: 3,  discount: 15 }, { id: 16, discount: 20 },
  { id: 17, discount: 25 }, { id: 19, discount: 18 },
  { id: 24, discount: 12 }, { id: 39, discount: 22 },
];

const Deals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const time = useCountdown();

  useEffect(() => {
    axios.get(`${API_BASE}/api/products`)
      .then(res => {
        const ids = DEALS_CONFIG.map(d => d.id);
        const filtered = res.data.filter(p => ids.includes(p.id)).map(p => ({
          ...p,
          discount: DEALS_CONFIG.find(d => d.id === p.id)?.discount || 10,
        }));
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  const original = (price, discount) =>
    Math.round(price / (1 - discount / 100)).toLocaleString();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)' }}>

      {/* ── Hero Banner ── */}
      <div className="deals-hero">
        <div className="deals-hero-orb deals-hero-orb-1" />
        <div className="deals-hero-orb deals-hero-orb-2" />
        <div className="deals-hero-content">
          <div className="deals-hero-badge">🔥 Limited Time Offers</div>
          <h1 className="deals-hero-title">
            Today's Best <span>Deals</span>
          </h1>
          <p className="deals-hero-sub">
            Massive discounts on top products — only while stocks last
          </p>

          {/* Countdown */}
          <div className="deals-countdown-wrap">
            <span className="deals-countdown-label">⏰ Ends in</span>
            <div className="deals-countdown">
              <div className="deals-cd-box">
                <span className="deals-cd-num">{time.h}</span>
                <span className="deals-cd-lbl">HRS</span>
              </div>
              <span className="deals-cd-sep">:</span>
              <div className="deals-cd-box">
                <span className="deals-cd-num">{time.m}</span>
                <span className="deals-cd-lbl">MIN</span>
              </div>
              <span className="deals-cd-sep">:</span>
              <div className="deals-cd-box">
                <span className="deals-cd-num">{time.s}</span>
                <span className="deals-cd-lbl">SEC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Deals Grid ── */}
      <div className="sec-inner" style={{ padding: '48px 28px' }}>

        {/* Top banner strip */}
        <div className="deals-strip">
          <span>🚚 Free delivery on all deals today</span>
          <span>✅ 100% genuine products</span>
          <span>🔒 Secure Mobile Money payment</span>
          <span>📞 Support: +250 788 123 456</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            Loading deals...
          </div>
        ) : (
          <div className="deals-grid">
            {products.map(product => (
              <div key={product.id} className="deal-card">
                {/* Discount badge */}
                <div className="deal-discount-badge">−{product.discount}%</div>

                {/* Image */}
                <div className="deal-img-wrap">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image} alt={product.name}
                      className="deal-img"
                      onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                    />
                  </Link>
                  <div className="deal-img-overlay" />
                </div>

                {/* Body */}
                <div className="deal-body">
                  <p className="deal-cat">{product.category_name}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="deal-name">{product.name}</h3>
                  </Link>

                  <div className="deal-prices">
                    <span className="deal-price-new">RWF {product.price.toLocaleString()}</span>
                    <span className="deal-price-old">RWF {original(product.price, product.discount)}</span>
                  </div>

                  <div className="deal-savings">
                    You save: RWF {(Math.round(product.price / (1 - product.discount / 100)) - product.price).toLocaleString()}
                  </div>

                  {/* Stock bar */}
                  <div className="deal-stock-wrap">
                    <div className="deal-stock-bar">
                      <div
                        className="deal-stock-fill"
                        style={{ width: `${Math.min(100, (product.stock / 25) * 100)}%` }}
                      />
                    </div>
                    <span className="deal-stock-text">
                      {product.stock <= 5 ? `⚠️ Only ${product.stock} left!` : `${product.stock} in stock`}
                    </span>
                  </div>

                  <button
                    className="deal-add-btn"
                    onClick={() => handleAdd(product)}
                    disabled={product.stock === 0}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <p style={{ color: 'var(--slate-400)', marginBottom: 16, fontSize: 14 }}>
            Looking for more products?
          </p>
          <Link to="/shop" className="btn-view-all">Browse Full Store →</Link>
        </div>
      </div>
    </div>
  );
};

export default Deals;
