import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../config';

const Confirmation = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payStatus, setPayStatus] = useState('pending');

  useEffect(() => {
    const txRef = searchParams.get('tx_ref');
    const status = searchParams.get('status');

    // Step 1: If Flutterwave redirected back with tx_ref, verify payment
    const verifyAndLoad = async () => {
      if (txRef && status === 'successful') {
        try {
          await axios.get(`${API_BASE}/api/payment/verify/${txRef}`);
        } catch {
          // silent — we'll show whatever status is in DB
        }
      }

      // Step 2: Load order details
      try {
        const res = await axios.get(`${API_BASE}/api/payment/status/${orderId}`);
        setOrder(res.data);
        setPayStatus(res.data.status);
      } catch {
        // fallback to orders route
        try {
          const res = await axios.get(`${API_BASE}/api/orders/${orderId}`);
          setOrder(res.data);
          setPayStatus(res.data.status);
        } catch {
          setOrder(null);
        }
      }
      setLoading(false);
    };

    verifyAndLoad();
  }, [orderId, searchParams]);

  if (loading) return (
    <div className="loading-state">
      <div className="loading-spinner" />
      Confirming your order...
    </div>
  );

  if (!order) return <div className="loading-state">❌ Order not found</div>;

  const isPaid = payStatus === 'paid' || payStatus === 'successful';

  return (
    <div className="page">
      <div className="page-inner" style={{ maxWidth: 940 }}>

        {/* ── Hero ── */}
        <div className="conf-hero">
          <span className="conf-check">{isPaid ? '🎉' : '⏳'}</span>
          <h1 className="conf-title">{isPaid ? 'Payment Confirmed!' : 'Order Received!'}</h1>
          <p className="conf-sub">
            {isPaid
              ? 'Your payment was successful. Thank you for shopping with TechHub Rwanda!'
              : 'Your order is placed. Payment will be confirmed shortly.'}
          </p>
          <span className="conf-badge">Order #{order.id}</span>
        </div>

        {/* ── Payment status banner ── */}
        {!isPaid && (
          <div className="payment-pending" style={{ marginBottom: 24 }}>
            <div className="payment-pending-title">⏳ Payment Pending</div>
            <div className="payment-pending-sub">
              If you completed Mobile Money payment, it may take a few minutes to confirm.
            </div>
          </div>
        )}

        {/* ── Details grid ── */}
        <div className="conf-grid">
          <div className="conf-card">
            <h2 className="conf-card-title">📋 Customer Details</h2>
            <div className="conf-row">
              <span className="conf-lbl">Name</span>
              <span className="conf-val">{order.customer_name}</span>
            </div>
            <div className="conf-row">
              <span className="conf-lbl">Phone</span>
              <span className="conf-val">{order.phone}</span>
            </div>
            <div className="conf-row">
              <span className="conf-lbl">Address</span>
              <span className="conf-val">{order.address}</span>
            </div>
            <div className="conf-row">
              <span className="conf-lbl">Payment</span>
              {isPaid
                ? <span className="conf-paid">✅ PAID</span>
                : <span className="conf-status">⏳ PENDING</span>
              }
            </div>
            <div className="conf-row">
              <span className="conf-lbl">Date</span>
              <span className="conf-val">{new Date(order.created_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="conf-card">
            <h2 className="conf-card-title">🛍️ Items Ordered</h2>
            <div className="conf-items">
              {(order.items || []).map(item => (
                <div key={item.id} className="conf-item">
                  <img src={item.image} alt={item.product_name} className="conf-item-img"
                    onError={e => { e.target.src = 'https://via.placeholder.com/54?text=N/A'; }} />
                  <div className="conf-item-info">
                    <p className="conf-item-name">{item.product_name}</p>
                    <p className="conf-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="conf-item-price">RWF {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="sum-divider" />
            <div className="sum-total-row">
              <span className="sum-total-label">Total {isPaid ? 'Paid' : 'Due'}</span>
              <span className="sum-total-val">RWF {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── Delivery note ── */}
        <div className="delivery-banner">
          🚚 Your order will be delivered within <strong>24 hours</strong> to your address in Kigali.<br />
          📞 Questions? Call us: <strong>+250 788 123 456</strong>
        </div>

        <div className="conf-actions">
          <Link to="/" className="btn-conf-home">🏠 Back to Home</Link>
          <Link to="/shop" className="btn-conf-shop">🛍️ Shop More</Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
