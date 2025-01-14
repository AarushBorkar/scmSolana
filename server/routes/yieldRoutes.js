const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// Submit yield
router.post('/submit', (req, res) => {
  const { farmerId, crop, weight, price, tokensEarned } = req.body;
  const query = 'INSERT INTO yields (farmer_id, crop, weight, price, tokens_earned) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [farmerId, crop, weight, price, tokensEarned], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error submitting yield' });
    } else {
      res.status(201).json({ message: 'Yield submitted successfully' });
    }
  });
});

// Get yields for a farmer
router.get('/farmer/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM yields WHERE farmer_id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching yields' });
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;