const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all products
router.get('/', (req, res) => {
  const { category_id, search } = req.query;
  
  let query = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
  `;
  let params = [];

  if (category_id) {
    query += ` WHERE p.category_id = ?`;
    params.push(category_id);
  }

  if (search) {
    query += category_id ? ` AND` : ` WHERE`;
    query += ` p.name LIKE ?`;
    params.push(`%${search}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET single product
router.get('/:id', (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;
  db.get(query, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
});

// GET all categories
router.get('/categories/all', (req, res) => {
  db.all(`SELECT * FROM categories`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;