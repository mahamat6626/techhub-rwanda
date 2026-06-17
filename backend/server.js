const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://techhub-rwanda.vercel.app',
    'https://techhub-rwanda-60zn7tect-mahamat6626s-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));


// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🛒 Welcome to TechHub Rwanda API',
    status: 'running'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});