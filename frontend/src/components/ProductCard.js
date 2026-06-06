import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added!`, { icon: '🛒' });
  };

  return (
    <div className="prod-card">
      <div className="prod-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="prod-img"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x225?text=No+Image'; }}
        />
        <div className="prod-img-overlay" />
        {product.stock > 0
          ? <span className="prod-badge">In Stock</span>
          : <span className="prod-badge-out">Sold Out</span>
        }
        <Link to={`/product/${product.id}`} className="prod-quick-view">Quick View →</Link>
      </div>

      <div className="prod-body">
        <p className="prod-cat">{product.category_name}</p>
        <h3 className="prod-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="prod-footer">
          <div>
            <div className="prod-price">RWF {product.price.toLocaleString()}</div>
            <div className="prod-price-sub">Rwandan Franc</div>
          </div>
          <button
            className="prod-add-btn"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
