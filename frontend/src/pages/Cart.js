import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-ico">🛒</span>
        <h2 className="empty-title">Your cart is empty</h2>
        <p className="empty-sub">Discover amazing deals and add items to get started</p>
        <Link to="/shop" className="btn-empty-cta">Browse Products →</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-inner">
        <h1 className="page-title">🛒 Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image} alt={item.name}
                  className="cart-item-img"
                  onError={e => { e.target.src = 'https://via.placeholder.com/100?text=N/A'; }}
                />
                <div className="cart-item-info">
                  <p className="cart-item-cat">{item.category_name}</p>
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-unit">RWF {item.price.toLocaleString()} each</p>
                </div>
                <div className="cart-item-right">
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-item-subtotal">RWF {(item.price * item.quantity).toLocaleString()}</span>
                  <button className="cart-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
            <button className="cart-clear" onClick={clearCart}>🗑 Clear Cart</button>
          </div>

          <div className="sum-card">
            <h2 className="sum-title">Order Summary</h2>
            <div className="sum-rows">
              {cartItems.map(item => (
                <div key={item.id} className="sum-row">
                  <span>{item.name} ×{item.quantity}</span>
                  <span>RWF {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="sum-divider" />
            <div className="sum-total-row">
              <span className="sum-total-label">Total</span>
              <span className="sum-total-val">RWF {totalPrice.toLocaleString()}</span>
            </div>
            <Link to="/checkout" className="btn-to-checkout">Checkout →</Link>
            <Link to="/shop" className="btn-keep-shopping">← Keep Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
