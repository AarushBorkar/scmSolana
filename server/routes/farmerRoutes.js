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
    const [insertResult] = await db.query('INSERT INTO farmers (aadhaar, name, wallet, wallet_balance) VALUES (?, ?, ?, ?)', [aadhaar, name, wallet, 0]);

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

// Yield Submission (POST)
router.post('/yields/submit', async (req, res) => {
  console.log('POST /api/yields/submit called');
  const { aadhaar, crop, weight, price } = req.body;

  // Validate input
  if (!aadhaar || !crop || !weight || !price) {
    return res.status(400).json({ message: 'All fields (aadhaar, crop, weight, price) are required' });
  }

  try {
    // Find farmer by Aadhaar
    const [farmerResults] = await db.query('SELECT * FROM farmers WHERE aadhaar = ?', [aadhaar]);

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

    res.status(201).json({ message: 'Yield submitted successfully', yieldId: insertResult.insertId, newBalance });

  } catch (err) {
    console.error('Database error during yield submission:', err);
    return res.status(500).json({ message: 'Error submitting yield' });
  }
});

// Get Yields for a Farmer (GET)
router.get('/yields/farmer/:aadhaar', async (req, res) => {
  const { aadhaar } = req.params;
  console.log(`GET /api/yields/farmer/${aadhaar} called`);

  try {
    // Find farmer by Aadhaar
    const [farmerResults] = await db.query('SELECT * FROM farmers WHERE aadhaar = ?', [aadhaar]);

    if (farmerResults.length === 0) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const farmerId = farmerResults[0].id;

    // Get all yields for the farmer
    const [yieldsResults] = await db.query('SELECT * FROM yields WHERE farmer_id = ?', [farmerId]);

    res.status(200).json(yieldsResults);

  } catch (err) {
    console.error('Database error during yield retrieval:', err);
    return res.status(500).json({ message: 'Error fetching yields' });
  }
});

// Get Farmer's Total Tokens (GET)
router.get('/farmers/:aadhaar/total-tokens', async (req, res) => {
  const { aadhaar } = req.params;

  try {
    // Find farmer by Aadhaar
    const [farmerResults] = await db.query('SELECT * FROM farmers WHERE aadhaar = ?', [aadhaar]);

    if (farmerResults.length === 0) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const farmerId = farmerResults[0].id;

    // Get total tokens earned by the farmer
    const [tokensResult] = await db.query('SELECT SUM(tokens_earned) AS total_tokens FROM yields WHERE farmer_id = ?', [farmerId]);

    res.status(200).json({ total_tokens: tokensResult[0].total_tokens || 0 });

  } catch (err) {
    console.error('Database error during token calculation:', err);
    return res.status(500).json({ message: 'Error calculating tokens' });
  }
});

// Get Farmer's Wallet Balance (GET)
router.get('/farmers/:aadhaar/wallet-balance', async (req, res) => {
  const { aadhaar } = req.params;

  try {
    // Find farmer by Aadhaar
    const [results] = await db.query('SELECT wallet_balance FROM farmers WHERE aadhaar = ?', [aadhaar]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.status(200).json({ wallet_balance: results[0].wallet_balance });

  } catch (err) {
    console.error('Database error during wallet balance retrieval:', err);
    return res.status(500).json({ message: 'Error fetching wallet balance' });
  }
});

module.exports = router;