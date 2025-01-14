const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// Submit yield (POST)
router.post('/submit', async (req, res) => {
  const { aadhaar, crop, weight, price } = req.body;

  // Validate input fields
  if (!aadhaar || !crop || !weight || !price) {
    return res.status(400).json({ message: 'All fields (aadhaar, crop, weight, price) are required' });
  }

  try {
    // Find the farmer by Aadhaar
    const [farmerResults] = await db.query('SELECT id, wallet_balance FROM farmers WHERE aadhaar = ?', [aadhaar]);

    if (farmerResults.length === 0) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const farmerId = farmerResults[0].id;

    // Calculate tokens earned (for example, 10 tokens per unit of weight)
    const tokensEarned = weight * price * 10;

    // Insert the yield into the database
    const [insertResult] = await db.query('INSERT INTO yields (farmer_id, crop, weight, price, tokens_earned) VALUES (?, ?, ?, ?, ?)', [farmerId, crop, weight, price, tokensEarned]);

    // Update the farmer's wallet balance
    const newBalance = farmerResults[0].wallet_balance + tokensEarned;
    await db.query('UPDATE farmers SET wallet_balance = ? WHERE id = ?', [newBalance, farmerId]);

    res.status(201).json({
      message: 'Yield submitted successfully',
      yieldId: insertResult.insertId,
      newBalance
    });

  } catch (err) {
    console.error('Database error during yield submission:', err);
    res.status(500).json({ message: 'Error submitting yield' });
  }
});

// Get yields for a farmer (GET)
router.get('/farmer/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query('SELECT * FROM yields WHERE farmer_id = ?', [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No yields found for this farmer' });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Database error during yield retrieval:', err);
    res.status(500).json({ message: 'Error fetching yields' });
  }
});

module.exports = router;