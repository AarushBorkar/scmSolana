const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// Farmer Registration (POST)
router.post('/register', (req, res) => {
  const { aadhaar, name, wallet } = req.body;

  // Check if the Aadhaar number already exists
  const checkQuery = 'SELECT * FROM farmers WHERE aadhaar = ?';

  db.query(checkQuery, [aadhaar], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error checking farmer' });
    }

    // If Aadhaar already exists, return a 400 error
    if (results.length > 0) {
      return res.status(400).json({ message: 'Farmer with this Aadhaar number already exists' });
    }

    // If Aadhaar doesn't exist, insert the new farmer
    const insertQuery = 'INSERT INTO farmers (aadhaar, name, wallet) VALUES (?, ?, ?)';

    db.query(insertQuery, [aadhaar, name, wallet], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error registering farmer' });
      }

      res.status(201).json({ message: 'Farmer registered successfully', farmerId: results.insertId });
    });
  });
});

// Get farmer by Aadhaar
router.get('/:aadhaar', (req, res) => {
  const { aadhaar } = req.params;
  const query = 'SELECT * FROM farmers WHERE aadhaar = ?';

  db.query(query, [aadhaar], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching farmer' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Farmer not found' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

module.exports = router;