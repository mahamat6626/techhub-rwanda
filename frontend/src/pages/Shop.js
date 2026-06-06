import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import API_BASE from '../config';

const CAT_ICONS = { 1: '📱', 2: '💻', 3: '🎧', 4: '📺', 5: '🔌' };

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const categoryId = searchParams.get('category');

  useEffect(() => {
    axios.get(`${API_BASE}/api/products/categories/all`).then(r => setCategories(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `${API_BASE}/api/products?`;
    if (categoryId) url += `category_id=${categoryId}&`;
    if (search) url += `search=${search}`;
    axios.get(url).then(r => { setProducts(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [categoryId, search]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--g50)' }}>
      <div className="shop-hero">
        <h1 className="shop-hero-title">All Products</h1>
        <p className="shop-hero-sub">{products.length} items available</p>
      </div>

      <div className="shop-body">
        <div className="shop-search-wrap">
          <span className="shop-search-ico">🔍</span>
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="shop-search"
          />
        </div>

        <div className="shop-filters">
          <button className={`filter-btn${!categoryId ? ' filter-btn-active' : ''}`} onClick={() => setSearchParams({})}>
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn${categoryId === String(cat.id) ? ' filter-btn-active' : ''}`}
              onClick={() => setSearchParams({ category: cat.id })}
            >
              {CAT_ICONS[cat.id]} {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="shop-empty">
            <span className="shop-empty-ico">😕</span>
            <p className="shop-empty-text">No products found. Try a different search.</p>
          </div>
        ) : (
          <div className="prod-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
