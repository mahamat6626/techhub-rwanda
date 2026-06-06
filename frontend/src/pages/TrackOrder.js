import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../config';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_META = {
  pending:   { icon: '⏳', label: 'Order Pending',    color: '#f59e0b', desc: 'Your order has been received and is awaiting confirmation.' },
  paid:      { icon: '✅', label: 'Payment Confirmed', color: '#00c896', desc: 'Payment received. Your order is being prepared.' },
  confirmed: { icon: '📦', label: 'Order Confirmed',  color: '#4361ee', desc: 'Your order is confirmed and being packed.' },
  shipped:   { icon: '🚚', label: 'Out for Delivery', color: '#f5a623', desc: 'Your order is on the way to your address.' },
  delivered: { icon: '🎉', label: 'Delivered',        color: '#00c896', desc: 'Your order has been delivered. Enjoy!' },
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const track = async e => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await axios.get(`${API_BASE}/api/payment/status/${orderId.trim()}`);
      setOrder(res.data);
    } catch {
      try {
        const res = await axios.get(`${API_BASE}/api/orders/${orderId.trim()}`);
        setOrder(res.data);
      } catch {
        setError('Order not found. Please check your order number and try again.');
      }
    }
    setLoading(false);
  };

  const meta = order ? (STATUS_META[order.status] || STATUS_META.pending) : null;
  const stepIndex = order ? Math.max(0, STATUS_STEPS.indexOf(order.status)) : -1;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)' }}>

      {/* ── Header ── */}
      <div className="track-hero">
        <div className="track-hero-content">
          <h1 className="track-hero-title">📦 Track Your Order</h1>
          <p className="track-hero-sub">Enter your order number to see real-time status</p>
        </div>
      </div>

      <div className="sec-inner" style={{ padding: '48px 28px', maxWidth: 760 }}>

        {/* Search form */}
        <div className="track-search-card">
          <h2 className="track-search-title">Enter Order Number</h2>
          <form onSubmit={track} className="track-form">
            <div className="track-input-wrap">
              <span className="track-input-ico">🔍</span>
              <input
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="e.g. 12"
                className="track-input"
              />
            </div>
            <button type="submit" className="track-btn" disabled={loading}>
              {loading
                ? <><div className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Tracking...</>
                : <>Track Order →</>
              }
            </button>
          </form>
          {error && (
            <div className="track-error">
              ❌ {error}
            </div>
          )}
          <p className="track-hint">
            💡 Your order number was shown on the confirmation page after checkout
          </p>
        </div>

        {/* Result */}
        {order && (
          <div className="track-result">

            {/* Status header */}
            <div className="track-status-card" style={{ borderColor: meta.color + '44', background: meta.color + '08' }}>
              <span className="track-status-icon">{meta.icon}</span>
              <div>
                <div className="track-status-label" style={{ color: meta.color }}>{meta.label}</div>
                <div className="track-status-desc">{meta.desc}</div>
              </div>
              <div className="track-order-id">#{order.id}</div>
            </div>

            {/* Progress bar */}
            <div className="track-progress-wrap">
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div className={`track-progress-step ${i <= stepIndex ? 'active' : ''}`}>
                    <div className="track-progress-dot">
                      {i <= stepIndex ? '✓' : i + 1}
                    </div>
                    <span className="track-progress-lbl">
                      {STATUS_META[step]?.label || step}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`track-progress-line ${i < stepIndex ? 'active' : ''}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Order details grid */}
            <div className="track-details-grid">
              <div className="track-detail-card">
                <h3 className="track-detail-title">👤 Customer</h3>
                <div className="track-detail-row">
                  <span>Name</span><span>{order.customer_name}</span>
                </div>
                <div className="track-detail-row">
                  <span>Phone</span><span>{order.phone}</span>
                </div>
                <div className="track-detail-row">
                  <span>Address</span><span>{order.address}</span>
                </div>
                <div className="track-detail-row">
                  <span>Date</span>
                  <span>{new Date(order.created_at).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="track-detail-card">
                <h3 className="track-detail-title">🛍️ Items</h3>
                {(order.items || []).map(item => (
                  <div key={item.id} className="track-item">
                    <img
                      src={item.image} alt={item.product_name}
                      className="track-item-img"
                      onError={e => { e.target.src = 'https://via.placeholder.com/44?text=N/A'; }}
                    />
                    <div className="track-item-info">
                      <div className="track-item-name">{item.product_name}</div>
                      <div className="track-item-qty">×{item.quantity}</div>
                    </div>
                    <div className="track-item-price">
                      RWF {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
                <div className="track-total-row">
                  <span>Total</span>
                  <span>RWF {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/shop" className="btn-empty-cta">Continue Shopping →</Link>
            </div>
          </div>
        )}

        {/* Help box */}
        {!order && !loading && (
          <div className="track-help">
            <h3 className="track-help-title">Need Help?</h3>
            <div className="track-help-items">
              <div className="track-help-item">
                <span className="track-help-icon">📞</span>
                <div>
                  <div className="track-help-label">Call Us</div>
                  <div className="track-help-val">+250 788 123 456</div>
                </div>
              </div>
              <div className="track-help-item">
                <span className="track-help-icon">📧</span>
                <div>
                  <div className="track-help-label">Email Us</div>
                  <div className="track-help-val">support@techhub.rw</div>
                </div>
              </div>
              <div className="track-help-item">
                <span className="track-help-icon">⏰</span>
                <div>
                  <div className="track-help-label">Working Hours</div>
                  <div className="track-help-val">Mon–Sat, 8am–8pm</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
