const express = require('express');
const router = express.Router();
const db = require('../database');

// ──────────────────────────────────────────────
// HARDCODED ADMIN CREDENTIALS (simple approach)
// ──────────────────────────────────────────────
const ADMIN_EMAIL = 'admin@techhub.rw';
const ADMIN_PASSWORD = 'admin123';

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      message: '✅ Login successful',
      admin: { email: ADMIN_EMAIL, name: 'TechHub Admin' }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid email or password' });
});

// POST /api/admin/products — Add a new product
router.post('/products', (req, res) => {
  const { name, description, price, image, stock, category_id } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }

  const query = `
    INSERT INTO products (name, description, price, image, stock, category_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, description || '', price, image || '', stock || 0, category_id || null], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      message: '✅ Product added successfully',
      productId: this.lastID
    });
  });
});

// PUT /api/admin/products/:id — Update a product
router.put('/products/:id', (req, res) => {
  const { name, description, price, image, stock, category_id } = req.body;
  const { id } = req.params;

  let fields = [];
  let params = [];

  if (name !== undefined) { fields.push('name = ?'); params.push(name); }
  if (description !== undefined) { fields.push('description = ?'); params.push(description); }
  if (price !== undefined) { fields.push('price = ?'); params.push(price); }
  if (image !== undefined) { fields.push('image = ?'); params.push(image); }
  if (stock !== undefined) { fields.push('stock = ?'); params.push(stock); }
  if (category_id !== undefined) { fields.push('category_id = ?'); params.push(category_id); }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  params.push(id);
  const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: '✅ Product updated successfully' });
  });
});

// DELETE /api/admin/products/:id — Delete a product
router.delete('/products/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: '✅ Product deleted successfully' });
  });
});

// GET /api/admin/orders — Get all orders with customer info
router.get('/orders', (req, res) => {
  const query = `
    SELECT o.*, c.name as customer_name, c.email, c.phone, c.address
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
  `;

  db.all(query, [], (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });

    // Get items for each order
    const itemQuery = `
      SELECT oi.*, p.name as product_name, p.image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

    let completed = 0;
    orders.forEach((order, index) => {
      db.all(itemQuery, [order.id], (err, items) => {
        order.items = items || [];
        completed++;
        if (completed === orders.length) {
          res.json(orders);
        }
      });
    });

    if (orders.length === 0) res.json([]);
  });
});

// GET /api/admin/stats — Dashboard statistics
router.get('/stats', (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as total FROM products', [], (err, row) => {
    stats.totalProducts = row ? row.total : 0;

    db.get('SELECT COUNT(*) as total FROM orders', [], (err, row) => {
      stats.totalOrders = row ? row.total : 0;

      db.get('SELECT COUNT(*) as total FROM customers', [], (err, row) => {
        stats.totalCustomers = row ? row.total : 0;

        db.get('SELECT COALESCE(SUM(total), 0) as total FROM orders', [], (err, row) => {
          stats.totalRevenue = row ? row.total : 0;

          // Revenue by category
          db.all(`
            SELECT c.name, COALESCE(SUM(oi.price * oi.quantity), 0) as revenue
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id
            LEFT JOIN order_items oi ON oi.product_id = p.id
            GROUP BY c.id
          `, [], (err, rows) => {
            stats.revenueByCategory = rows || [];

            // Orders by status
            db.all(`SELECT status, COUNT(*) as count FROM orders GROUP BY status`, [], (err, rows) => {
              stats.ordersByStatus = rows || [];

              // Recent 7 days revenue
              db.all(`
                SELECT DATE(created_at) as date, COALESCE(SUM(total), 0) as revenue
                FROM orders
                WHERE created_at >= DATE('now', '-7 days')
                GROUP BY DATE(created_at)
                ORDER BY date ASC
              `, [], (err, rows) => {
                stats.recentRevenue = rows || [];

                // Products per category
                db.all(`
                  SELECT c.name, COUNT(p.id) as count
                  FROM categories c
                  LEFT JOIN products p ON p.category_id = c.id
                  GROUP BY c.id
                `, [], (err, rows) => {
                  stats.productsByCategory = rows || [];
                  res.json(stats);
                });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;