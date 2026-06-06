import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import API_BASE from '../config';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`${API_BASE}/api/products/${id}`)
      .then(r => { setProduct(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${qty}× ${product.name} added!`, { icon: '🛒' });
  };

  if (loading) return (
    <div className="loading-state">
      <div className="loading-spinner" />
      Loading product...
    </div>
  );
  if (!product) return <div className="loading-state">❌ Product not found</div>;

  return (
    <div className="page">
      <div className="detail-wrap">
        <div className="breadcrumb">
          <Link to="/" className="bc-link">Home</Link>
          <span className="bc-sep">/</span>
          <Link to="/shop" className="bc-link">Shop</Link>
          <span className="bc-sep">/</span>
          <span className="bc-cur">{product.name}</span>
        </div>

        <div className="detail-card">
          <div className="detail-img-side">
            <img src={product.image} alt={product.name} className="detail-img"
              onError={e => { e.target.src = 'https://via.placeholder.com/500x460?text=No+Image'; }} />
          </div>

          <div className="detail-info">
            <p className="detail-cat">{product.category_name}</p>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-price-wrap">
              <span className="detail-price">RWF {product.price.toLocaleString()}</span>
              <span className="detail-price-label">Rwandan Franc</span>
            </div>

            <p className="detail-desc">{product.description}</p>

            {product.stock > 0
              ? <span className="stock-in">✅ In Stock · {product.stock} units</span>
              : <span className="stock-out">❌ Out of Stock</span>
            }

            {product.stock > 0 && (
              <div className="detail-qty-row">
                <span className="detail-qty-lbl">Quantity</span>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <span className="qty-val">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                </div>
              </div>
            )}

            <div className="detail-total-box">
              Subtotal: <strong>RWF {(product.price * qty).toLocaleString()}</strong>
            </div>

            <div className="detail-btns">
              <button className="btn-add-to-cart" onClick={handleAdd} disabled={product.stock === 0}>
                🛒 Add to Cart
              </button>
              <Link to="/cart" className="btn-view-cart-link">View Cart</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
