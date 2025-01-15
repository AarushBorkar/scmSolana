const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Route: Fetch all yields
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all yields...');
    const [yields] = await db.query(`
      SELECT 
        yields.id, 
        farmers.name AS farmer_name, 
        yields.crop, 
        yields.weight, 
        yields.price, 
        yields.tokens_earned 
      FROM yields 
      JOIN farmers ON yields.farmer_id = farmers.id
    `);
    console.log('Yields fetched successfully:', yields);
    res.json(yields);
  } catch (error) {
    console.error('Error fetching yields:', error.message);
    res.status(500).json({ error: 'Failed to fetch yields' });
  }
});

// Route: Add a new yield entry
router.post('/add', async (req, res) => {
  const { farmer_id, crop, weight, price } = req.body;

  console.log('Adding a new yield with data:', { farmer_id, crop, weight, price });

  // Validate input
  if (!farmer_id || !crop || !weight || !price) {
    console.error('Missing required fields:', { farmer_id, crop, weight, price });
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const tokens_earned = weight * price; // Calculate tokens earned
    const [result] = await db.query(
      'INSERT INTO yields (farmer_id, crop, weight, price, tokens_earned) VALUES (?, ?, ?, ?, ?)',
      [farmer_id, crop, weight, price, tokens_earned]
    );
    console.log('Yield added successfully:', result);
    res.json({ message: 'Yield added successfully' });
  } catch (error) {
    console.error('Error adding yield:', error.message);
    res.status(500).json({ error: 'Failed to add yield' });
  }
});

module.exports = router;