const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// Farmer Registration (POST)
router.post('/register', async (req, res) => {
  console.log('POST /api/farmers/register called');
  const { aadhaar, name, wallet } = req.body;

  if (!aadhaar || !name || !wallet) {
    console.error('Missing fields:', { aadhaar, name, wallet });
    return res.status(400).json({ message: 'All fields (aadhaar, name, wallet) are required' });
  }

  try {
    // Check if the Aadhaar number already exists
    const [results] = await db.query('SELECT * FROM farmers WHERE aadhaar = ?', [aadhaar]);

    if (results.length > 0) {
      console.log('Duplicate Aadhaar found:', aadhaar);
      return res.status(400).json({ message: 'Farmer with this Aadhaar number already exists' });
    }

    // If Aadhaar doesn't exist, insert the new farmer
    const [insertResult] = await db.query('INSERT INTO farmers (aadhaar, name, wallet) VALUES (?, ?, ?)', [aadhaar, name, wallet]);

    console.log('Farmer registered successfully:', { farmerId: insertResult.insertId });
    return res.status(201).json({ message: 'Farmer registered successfully', farmerId: insertResult.insertId });
  } catch (err) {
    console.error('Database error during farmer registration:', err);
    return res.status(500).json({ message: 'Error registering farmer' });
  }
});

// Get farmer by Aadhaar (GET)
router.get('/:aadhaar', async (req, res) => {
  const { aadhaar } = req.params;
  console.log(`GET /api/farmers/${aadhaar} called`);

  try {
    const [results] = await db.query('SELECT * FROM farmers WHERE aadhaar = ?', [aadhaar]);

    if (results.length === 0) {
      console.log('Farmer not found for Aadhaar:', aadhaar);
      return res.status(404).json({ message: 'Farmer not found' });
    }

    console.log('Farmer fetched successfully:', results[0]);
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Database error during farmer retrieval:', err);
    return res.status(500).json({ message: 'Error fetching farmer' });
  }
});

module.exports = router;