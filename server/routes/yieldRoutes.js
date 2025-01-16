const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Route: Fetch all yields
router.get('/', async (req, res) => {
  try {
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
    res.json(yields);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch yields' });
  }
});

// Route: Add a new yield entry and update farmer's wallet balance
router.post('/add', async (req, res) => {
  const { farmer_id, crop, weight, price } = req.body;

  // Validate input
  if (!farmer_id || !crop || !weight || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Calculate tokens earned
    const tokens_earned = weight * price;

    // Start a transaction
    await db.beginTransaction();

    // Add the new yield entry
    await db.query(
      'INSERT INTO yields (farmer_id, crop, weight, price, tokens_earned) VALUES (?, ?, ?, ?, ?)',
      [farmer_id, crop, weight, price, tokens_earned]
    );

    // Fetch the current wallet balance of the farmer
    const [farmer] = await db.query('SELECT wallet_balance FROM farmers WHERE id = ?', [farmer_id]);
    if (!farmer.length) {
      throw new Error('Farmer not found');
    }

    const currentBalance = parseFloat(farmer[0].wallet_balance);

    // Update the farmer's wallet_balance
    const newBalance = currentBalance + tokens_earned;
    await db.query('UPDATE farmers SET wallet_balance = ? WHERE id = ?', [newBalance, farmer_id]);

    // Commit the transaction
    await db.commit();

    res.json({ message: 'Yield added successfully and wallet balance updated', tokens_earned });
  } catch (error) {
    // Rollback transaction in case of an error
    await db.rollback();
    res.status(500).json({ error: 'Failed to add yield and update wallet balance' });
  }
});

module.exports = router;