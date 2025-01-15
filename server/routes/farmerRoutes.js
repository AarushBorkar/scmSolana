const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Route: Fetch all farmers
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all farmers...');
    const [farmers] = await db.query('SELECT * FROM farmers');
    console.log('Farmers fetched successfully:', farmers);
    res.json(farmers); // Send farmers data as JSON
  } catch (error) {
    console.error('Error fetching farmers:', error.message);
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

// Route: Register a new farmer
router.post('/register', async (req, res) => {
  const { aadhaar, name, wallet } = req.body;

  console.log('Registering a new farmer with data:', { aadhaar, name, wallet });

  // Validate input
  if (!aadhaar || !name || !wallet) {
    console.error('Missing required fields:', { aadhaar, name, wallet });
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if farmer already exists
    const [existingFarmer] = await db.query('SELECT * FROM farmers WHERE aadhaar = ?', [aadhaar]);
    if (existingFarmer.length > 0) {
      console.error('Farmer already exists with Aadhaar:', aadhaar);
      return res.status(400).json({ error: 'Farmer already exists' });
    }

    // Insert new farmer
    const [result] = await db.query(
      'INSERT INTO farmers (aadhaar, name, wallet) VALUES (?, ?, ?)',
      [aadhaar, name, wallet]
    );
    console.log('Farmer registered successfully:', result);
    res.json({ message: 'Farmer registered successfully' });
  } catch (error) {
    console.error('Error registering farmer:', error.message);
    res.status(500).json({ error: 'Failed to register farmer' });
  }
});

module.exports = router;