import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import API_BASE from '../config';

/* ── Real brand SVG logos ── */
const MTN_LOGO = (
  <svg width="56" height="28" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="56" height="28" rx="6" fill="#FFCC00"/>
    <text x="28" y="20" textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight="900"
      fontSize="13" fill="#1A1A1A" letterSpacing="0.5">MTN</text>
  </svg>
);

const AIRTEL_LOGO = (
  <svg width="56" height="28" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="56" height="28" rx="6" fill="#E40000"/>
    <text x="28" y="19" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800"
      fontSize="11" fill="#FFFFFF" letterSpacing="0.3">airtel</text>
    {/* Airtel swoosh arc */}
    <path d="M18 22 Q28 16 38 22" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

const PAYMENT_METHODS = [
  {
    id: 'mtn',
    logo: MTN_LOGO,
    name: 'MTN Mobile Money',
    desc: 'Pay instantly — a request is pushed to your MTN MoMo number',
    tag: 'POPULAR',
    tagClass: 'tag-popular',
    color: '#FFCC00',
    textColor: '#1A1A1A',
    border: 'rgba(255,204,0,0.4)',
    bg: 'rgba(255,204,0,0.06)',
  },
  {
    id: 'airtel',
    logo: AIRTEL_LOGO,
    name: 'Airtel Money',
    desc: 'Pay instantly — a request is pushed to your Airtel Money number',
    tag: null,
    color: '#E40000',
    textColor: '#FFFFFF',
    border: 'rgba(228,0,0,0.3)',
    bg: 'rgba(228,0,0,0.05)',
  },
];

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState('mtn');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  const selected = PAYMENT_METHODS.find(m => m.id === payMethod);
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error('Please fill all required fields'); return;
    }
    if (!cartItems.length) {
      toast.error('Your cart is empty'); return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/payment/initiate`, {
        customer: { ...form, payment_method: payMethod },
        items: cartItems,
        total: totalPrice,
      });
      clearCart();
      toast.success(
        res.data.paypack_error
          ? 'Order placed! Awaiting payment confirmation.'
          : '📱 Check your phone to approve the payment!',
        { duration: 5000 }
      );
      navigate(`/confirmation/${res.data.order_id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong. Try again.');
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="empty-state">
        <span className="empty-ico">📦</span>
        <h2 className="empty-title">Cart is empty</h2>
        <p className="empty-sub">Add products before checking out.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-inner">
        <h1 className="page-title">📦 Checkout</h1>

        <div className="checkout-grid">

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Customer details */}
            <div className="form-block" style={{ marginBottom: 24 }}>
              <h2 className="form-block-title">👤 Your Details</h2>
              <form id="checkout-form" onSubmit={submit}>
                <div className="form-field">
                  <label className="form-lbl">Full Name *</label>
                  <input name="name" value={form.name} onChange={handle}
                    placeholder="e.g. Jean Pierre Nkurunziza" className="form-inp" required />
                </div>
                <div className="form-field">
                  <label className="form-lbl">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handle}
                    placeholder="Optional — for receipt" className="form-inp" />
                </div>
                <div className="form-field">
                  <label className="form-lbl">Phone Number * (MoMo number)</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handle}
                    placeholder="e.g. 0788 123 456" className="form-inp" required />
                </div>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-lbl">Delivery Address *</label>
                  <textarea name="address" value={form.address} onChange={handle}
                    placeholder="Street, District, Kigali" className="form-txta" rows={4} required />
                </div>
              </form>
            </div>

            {/* Payment methods */}
            <div className="form-block">
              <h2 className="form-block-title">💳 Choose Payment Method</h2>

              <div className="pay-methods">
                {PAYMENT_METHODS.map(m => (
                  <div
                    key={m.id}
                    className={`pay-method-opt${payMethod === m.id ? ' selected' : ''}`}
                    onClick={() => setPayMethod(m.id)}
                    style={payMethod === m.id ? {
                      borderColor: m.border,
                      background: m.bg,
                      boxShadow: `0 0 0 4px ${m.bg}`,
                    } : {}}
                  >
                    {/* Radio */}
                    <div className="pay-radio" style={payMethod === m.id ? { borderColor: m.color } : {}}>
                      <div className="pay-radio-dot" style={{ background: m.color }} />
                    </div>

                    {/* Brand logo */}
                    <div className="pay-brand-logo">
                      {m.logo}
                    </div>

                    {/* Info */}
                    <div className="pay-method-info">
                      <div className="pay-method-name">{m.name}</div>
                      <div className="pay-method-desc">{m.desc}</div>
                    </div>

                    {/* Tag */}
                    {m.tag && (
                      <span className={`pay-method-tag ${m.tagClass}`}>{m.tag}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* How it works */}
              <div className="pay-how-it-works">
                <div className="pay-step">
                  <span className="pay-step-num">1</span>
                  <span>Click "Pay Now" below</span>
                </div>
                <div className="pay-step-arrow">→</div>
                <div className="pay-step">
                  <span className="pay-step-num">2</span>
                  <span>You receive a prompt on your phone</span>
                </div>
                <div className="pay-step-arrow">→</div>
                <div className="pay-step">
                  <span className="pay-step-num">3</span>
                  <span>Enter your PIN to confirm</span>
                </div>
              </div>

              {/* Security note */}
              <div className="pay-secure-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Secured by PayPack — Rwanda's official Mobile Money gateway
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="btn-place-order"
                disabled={loading}
                style={selected ? {
                  background: `linear-gradient(135deg, ${selected.color}, ${selected.color}dd)`,
                  color: selected.textColor,
                  boxShadow: `0 8px 28px ${selected.border}`,
                } : {}}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2, borderTopColor: selected?.textColor || '#fff' }} />
                    Sending to your phone...
                  </>
                ) : (
                  <>
                    {selected?.logo}
                    <span>Pay RWF {totalPrice.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div className="sum-card">
            <h2 className="sum-title">Order Summary</h2>
            <div className="co-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="co-item">
                  <img src={item.image} alt={item.name} className="co-item-img"
                    onError={e => { e.target.src = 'https://via.placeholder.com/60?text=N/A'; }} />
                  <div className="co-item-info">
                    <p className="co-item-name">{item.name}</p>
                    <p className="co-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="co-item-price">RWF {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="sum-divider" />
            <div className="sum-rows" style={{ marginBottom: 16 }}>
              <div className="sum-row">
                <span>Subtotal</span>
                <span>RWF {totalPrice.toLocaleString()}</span>
              </div>
              <div className="sum-row">
                <span>Delivery</span>
                <span style={{ color: 'var(--success)', fontWeight: 800 }}>FREE</span>
              </div>
            </div>
            <div className="sum-divider" />
            <div className="sum-total-row">
              <span className="sum-total-label">Total</span>
              <span className="sum-total-val">RWF {totalPrice.toLocaleString()}</span>
            </div>

            {/* Selected payment display */}
            <div className="pay-selected-display" style={{
              borderColor: selected?.border,
              background: selected?.bg,
            }}>
              <span style={{ fontSize: 13, color: 'var(--slate-500)' }}>Paying with</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {selected?.logo}
                <span style={{ fontWeight: 800, color: 'var(--slate-800)', fontSize: 13 }}>
                  {selected?.name}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
