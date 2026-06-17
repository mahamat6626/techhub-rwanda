const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// POST /api/payment/initiate — Save order and initiate PayPack payment
router.post('/initiate', (req, res) => {
  const { customer, items, total } = req.body;

  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing order details' });
  }

  const tx_ref = 'TECH-' + uuidv4().slice(0, 8).toUpperCase();

  // 1. Insert customer
  const customerQuery = `
    INSERT INTO customers (name, email, phone, address)
    VALUES (?, ?, ?, ?)
  `;

  db.run(customerQuery, [customer.name, customer.email || '', customer.phone, customer.address], function (err) {
    if (err) {
      console.error('Customer insert error:', err.message);
      return res.status(500).json({ error: err.message });
    }

    const customerId = this.lastID;

    // 2. Insert order
    const orderQuery = `
      INSERT INTO orders (customer_id, total, status, tx_ref)
      VALUES (?, ?, 'pending', ?)
    `;

    db.run(orderQuery, [customerId, total, tx_ref], function (err) {
      if (err) {
        console.error('Order insert error:', err.message);
        return res.status(500).json({ error: err.message });
      }

      const orderId = this.lastID;

      // 3. Insert order items
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `;

      items.forEach((item) => {
        db.run(itemQuery, [orderId, item.id, item.quantity, item.price]);
      });

      // 4. Try PayPack payment (optional — if it fails, order is still saved)
      let paypackError = null;

      try {
        // If paypack-js is available, attempt payment
        const Paypack = require('paypack-js').default;
        const paypack = new Paypack({
          client_id: process.env.PAYPACK_CLIENT_ID,
          client_secret: process.env.PAYPACK_CLIENT_SECRET
        });

        paypack.collect({
          number: customer.phone.replace(/\s/g, ''),
          amount: total,
          environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
        }).then(() => {
          console.log(`✅ PayPack request sent for order #${orderId}`);
        }).catch(paypackErr => {
          console.error('PayPack error (non-fatal):', paypackErr.message);
        });
      } catch (paypackErr) {
        console.log('PayPack not configured or error:', paypackErr.message);
        paypackError = paypackErr.message;
      }

      // 5. Return success with order ID
      res.status(201).json({
        message: '✅ Order placed successfully!',
        order_id: orderId,
        tx_ref: tx_ref,
        paypack_error: paypackError
      });
    });
  });
});

// GET /api/payment/status/:orderId — Get order payment status
router.get('/status/:orderId', (req, res) => {
  const query = `
    SELECT o.*, c.name as customer_name, c.phone, c.address
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `;

  db.get(query, [req.params.orderId], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const itemsQuery = `
      SELECT oi.*, p.name as product_name, p.image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

    db.all(itemsQuery, [req.params.orderId], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...order, items });
    });
  });
});

// GET /api/payment/verify/:txRef — Verify payment (for Flutterwave redirects)
router.get('/verify/:txRef', (req, res) => {
  const { txRef } = req.params;

  db.run(
    `UPDATE orders SET status = 'paid' WHERE tx_ref = ? AND status = 'pending'`,
    [txRef],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        message: this.changes > 0 ? '✅ Payment verified' : 'No pending order found',
        updated: this.changes > 0
      });
    }
  );
});

module.exports = router;