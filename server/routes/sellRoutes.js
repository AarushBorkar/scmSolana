const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// Get available stocks for a farmer
router.get('/stocks/:farmer_id', async (req, res) => {
  const { farmer_id } = req.params;

  try {
    const [stocks] = await db.query(
      `SELECT id, crop, weight, price FROM yields WHERE farmer_id = ?`,
      [farmer_id]
    );

    if (stocks.length === 0) {
      return res.status(404).json({ error: 'No stocks found for this farmer' });
    }

    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error.message);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

// Route for farmers to sell crops
router.post('/sell/:farmer_id', async (req, res) => {
  const { farmer_id } = req.params;
  const { crop, weight } = req.body;

  if (!crop || !weight) {
    return res.status(400).json({ error: 'All fields (crop, weight) are required' });
  }

  try {
    // Get stock details
    const [stocks] = await db.query(
      `SELECT id, weight, price FROM yields WHERE farmer_id = ? AND crop = ?`,
      [farmer_id, crop]
    );

    if (stocks.length === 0) {
      return res.status(404).json({ error: 'No stock of this crop found for the farmer' });
    }

    const stock = stocks[0];
    const saleWeight = parseFloat(weight);
    const salePrice = parseFloat(stock.price); // Get price from DB

    if (isNaN(saleWeight) || saleWeight <= 0) {
      return res.status(400).json({ error: 'Invalid weight value' });
    }

    if (parseFloat(stock.weight) < saleWeight) {
      return res.status(400).json({ error: 'Not enough stock available to sell' });
    }

    console.log(`Farmer ${farmer_id} is selling ${saleWeight}kg of ${crop} at ₹${salePrice}/kg`);

    // New weight after sale
    const newWeight = stock.weight - saleWeight;
    console.log(`New weight after sale: ${newWeight}`);

    // Deduct weight from stock
    await db.query(
      `UPDATE yields SET weight = weight - ? WHERE farmer_id = ? AND crop = ?`,
      [saleWeight, farmer_id, crop]
    );

    // **Check if any rows have weight = 0 and delete them**
    const [deleteResult] = await db.query(`DELETE FROM yields WHERE weight = 0`);
    console.log(`Deleted rows where weight = 0:`, deleteResult.affectedRows);

    // Insert sale record
    const [saleResult] = await db.query(
      `INSERT INTO sales (farmer_id, crop, weight, price) VALUES (?, ?, ?, ?)`,
      [farmer_id, crop, saleWeight, salePrice]
    );

    if (saleResult.insertId) {
      return res.json({
        message: 'Sale successful',
        crop,
        weight: saleWeight,
        price: salePrice,
        tokensToSend: saleWeight * salePrice,
      });
    } else {
      return res.status(500).json({ error: 'Failed to insert sale record' });
    }
  } catch (error) {
    console.error('Error processing sale:', error.message);
    res.status(500).json({ error: 'Failed to process sale' });
  }
});

module.exports = router;