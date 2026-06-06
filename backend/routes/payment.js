const express = require('express');
const router = express.Router();
const Paypack = require('paypack-js').default;
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

const paypack = new Paypack({
  client_id: process.env.PAYPACK_CLIENT_ID,
  client_secret: process.env.PAYPACK_CLIENT_SECRET,
});

// POST /api/payment/initiate
router.post('/initiate', (req, res) => {
  const { customer, items, total } = req.body;

  if (!customer || !items || !items.length) {
    return res.status(400).json({ error: 'Missing order details' });
  }

  const txRef = `TECHHUB-${uuidv4()}`;

  // Save customer
  db.run(
    `INSERT INTO customers (name, email, phone, address) VALUES (?,?,?,?)`,
    [customer.name, customer.email || '', customer.phone, customer.address],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const customerId = this.lastID;

      // Save order
      db.run(
        `INSERT INTO orders (customer_id, total, status, tx_ref) VALUES (?,?,'pending',?)`,
        [customerId, total, txRef],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          const orderId = this.lastID;

          // Save order items
          const stmt = db.prepare(
            `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)`
          );
          items.forEach(item => stmt.run(orderId, item.id, item.quantity, item.price));
          stmt.finalize();

          // Initiate PayPack cashin (customer pays)
          paypack.cashin({
            number: customer.phone,
            amount: Math.round(total),
          })
            .then(response => {
              // Update tx_ref with PayPack's ref if available
              const paypackRef = response?.data?.ref || txRef;
              db.run(`UPDATE orders SET tx_ref = ? WHERE id = ?`, [paypackRef, orderId]);

              res.json({
                status: 'pending',
                order_id: orderId,
                tx_ref: paypackRef,
                message: 'Payment request sent to your phone. Approve it to complete.',
              });
            })
            .catch(err => {
              console.error('PayPack error:', err.message);
              // Order is saved — mark it as pending even if PayPack fails
              res.json({
                status: 'pending',
                order_id: orderId,
                tx_ref: txRef,
                message: 'Order placed. Payment pending.',
                paypack_error: err.message,
              });
            });
        }
      );
    }
  );
});

// GET /api/payment/status/:order_id
router.get('/status/:order_id', (req, res) => {
  db.get(
    `SELECT o.*, c.name as customer_name, c.phone, c.address
     FROM orders o LEFT JOIN customers c ON o.customer_id = c.id
     WHERE o.id = ?`,
    [req.params.order_id],
    (err, order) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!order) return res.status(404).json({ error: 'Order not found' });

      db.all(
        `SELECT oi.*, p.name as product_name, p.image
         FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id],
        (err2, items) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ ...order, items });
        }
      );
    }
  );
});

// POST /api/payment/webhook — PayPack calls this when payment is confirmed
router.post('/webhook', express.json(), (req, res) => {
  const { data } = req.body;
  if (data?.ref) {
    db.run(
      `UPDATE orders SET status = 'paid' WHERE tx_ref = ?`,
      [data.ref],
      () => res.json({ status: 'ok' })
    );
  } else {
    res.json({ status: 'ignored' });
  }
});

module.exports = router;
