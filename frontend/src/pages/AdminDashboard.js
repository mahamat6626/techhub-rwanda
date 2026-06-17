import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', image: '', stock: '', category_id: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('techhub_admin');
    if (!stored) {
      navigate('/admin/login');
      return;
    }
    setAdmin(JSON.parse(stored));
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        axios.get(`${API}/api/admin/stats`),
        axios.get(`${API}/api/products`),
        axios.get(`${API}/api/admin/orders`)
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('techhub_admin');
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/admin/products`, {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        category_id: parseInt(form.category_id) || null
      });
      toast.success('✅ Product added!');
      setShowForm(false);
      setForm({ name: '', description: '', price: '', image: '', stock: '', category_id: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/api/admin/products/${id}`);
      toast.success('🗑️ Product deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const formatRWF = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' RWF';
  };

  const getStatusBadge = (status) => {
    const cls = status === 'pending' ? 'badge-pending' : status === 'confirmed' ? 'badge-confirmed' : 'badge-shipped';
    return <span className={`order-badge ${cls}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          ⚡ TechHub <span>Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          <button className={`admin-nav-btn${activeTab === 'overview' ? ' active' : ''}`} onClick={() => setActiveTab('overview')}>
            📊 Overview
          </button>
          <button className={`admin-nav-btn${activeTab === 'products' ? ' active' : ''}`} onClick={() => setActiveTab('products')}>
            📦 Products
          </button>
          <button className={`admin-nav-btn${activeTab === 'orders' ? ' active' : ''}`} onClick={() => setActiveTab('orders')}>
            📋 Orders
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">{admin?.name}</div>
          <button className="admin-logout-btn" onClick={handleLogout}>🚪 Logout</button>
          <Link to="/home" className="admin-back-link">← Back to Store</Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="admin-main">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            <h1 className="admin-page-title">Dashboard Overview</h1>
            <div className="admin-stats-grid">
              <div className="admin-stat-card" style={{ borderTop: '3px solid var(--gold)' }}>
                <div className="admin-stat-icon">💰</div>
                <div className="admin-stat-value">{formatRWF(stats?.totalRevenue || 0)}</div>
                <div className="admin-stat-label">Total Revenue</div>
              </div>
              <div className="admin-stat-card" style={{ borderTop: '3px solid var(--indigo)' }}>
                <div className="admin-stat-icon">📦</div>
                <div className="admin-stat-value">{stats?.totalOrders || 0}</div>
                <div className="admin-stat-label">Total Orders</div>
              </div>
              <div className="admin-stat-card" style={{ borderTop: '3px solid var(--success)' }}>
                <div className="admin-stat-icon">🏷️</div>
                <div className="admin-stat-value">{stats?.totalProducts || 0}</div>
                <div className="admin-stat-label">Products</div>
              </div>
              <div className="admin-stat-card" style={{ borderTop: '3px solid #f59e0b' }}>
                <div className="admin-stat-icon">👥</div>
                <div className="admin-stat-value">{stats?.totalCustomers || 0}</div>
                <div className="admin-stat-label">Customers</div>
              </div>
            </div>

            {/* Recent Orders */}
            <h2 className="admin-section-title">📋 Recent Orders</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.customer_name || 'N/A'}</td>
                      <td>{formatRWF(o.total)}</td>
                      <td>{getStatusBadge(o.status)}</td>
                      <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="5" className="admin-empty">No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            <div className="admin-tab-header">
              <h1 className="admin-page-title">📦 Products</h1>
              <button className="admin-add-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? '✕ Cancel' : '+ Add Product'}
              </button>
            </div>

            {showForm && (
              <form className="admin-product-form" onSubmit={handleAddProduct}>
                <div className="admin-form-grid">
                  <div className="admin-form-field">
                    <label>Product Name *</label>
                    <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div className="admin-form-field">
                    <label>Price (RWF) *</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
                  </div>
                  <div className="admin-form-field">
                    <label>Stock</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} />
                  </div>
                  <div className="admin-form-field">
                    <label>Category ID</label>
                    <select value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})}>
                      <option value="">Select category</option>
                      <option value="1">Phones & Tablets</option>
                      <option value="2">Computers & Laptops</option>
                      <option value="3">Audio</option>
                      <option value="4">TVs & Displays</option>
                      <option value="5">Accessories & Gadgets</option>
                    </select>
                  </div>
                  <div className="admin-form-field admin-form-full">
                    <label>Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="2" />
                  </div>
                  <div className="admin-form-field admin-form-full">
                    <label>Image URL</label>
                    <input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="https://..." />
                  </div>
                </div>
                <button type="submit" className="admin-submit-btn">➕ Add Product</button>
              </form>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>
                        <img src={p.image} alt="" className="admin-product-thumb" />
                      </td>
                      <td>{p.name}</td>
                      <td>{formatRWF(p.price)}</td>
                      <td>
                        <span className={p.stock < 5 ? 'stock-low' : 'stock-ok'}>
                          {p.stock}
                        </span>
                      </td>
                      <td>{p.category_name || '—'}</td>
                      <td>
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDeleteProduct(p.id)}
                          title="Delete product"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <>
            <h1 className="admin-page-title">📋 All Orders</h1>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer_name || 'N/A'}</td>
                      <td>{o.email || '—'}</td>
                      <td>{o.phone || '—'}</td>
                      <td>{formatRWF(o.total)}</td>
                      <td>{getStatusBadge(o.status)}</td>
                      <td>
                        {o.items?.map(i => (
                          <div key={i.id} className="admin-order-item">
                            {i.product_name} × {i.quantity}
                          </div>
                        )) || '—'}
                      </td>
                      <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="8" className="admin-empty">No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;