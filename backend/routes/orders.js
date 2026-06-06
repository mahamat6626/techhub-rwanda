const express = require('express');
const router = express.Router();
const db = require('../database');

// POST - Place a new order
router.post('/', (req, res) => {
  const { customer, items, total } = req.body;

  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing order details' });
  }

  // First insert customer
  const customerQuery = `
    INSERT INTO customers (name, email, phone, address)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    customerQuery,
    [customer.name, customer.email, customer.phone, customer.address],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const customerId = this.lastID;

      // Insert order
      const orderQuery = `
        INSERT INTO orders (customer_id, total, status)
        VALUES (?, ?, 'pending')
      `;

      db.run(orderQuery, [customerId, total], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const orderId = this.lastID;

        // Insert order items
        const itemQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `;

        items.forEach((item) => {
          db.run(itemQuery, [orderId, item.id, item.quantity, item.price]);
        });

        res.status(201).json({
          message: '✅ Order placed successfully!',
          orderId: orderId,
          customerId: customerId,
        });
      });
    }
  );
});

// GET - Get order by ID
router.get('/:id', (req, res) => {
  const orderQuery = `
    SELECT o.*, c.name as customer_name, c.phone, c.address
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `;

  db.get(orderQuery, [req.params.id], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Get order items
    const itemsQuery = `
      SELECT oi.*, p.name as product_name, p.image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

    db.all(itemsQuery, [req.params.id], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...order, items });
    });
  });
});

module.exports = router;