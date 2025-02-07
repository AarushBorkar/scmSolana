const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// Get available stocks for a farmer
router.get('/stocks/:farmer_id', async (req, res) => {
  const { farmer_id } = req.params;

  try {
    // Fetch the available stocks for the specific farmer
    const [stocks] = await db.query(`
      SELECT id, crop, weight, price
      FROM yields
      WHERE farmer_id = ?
    `, [farmer_id]);

    if (stocks.length === 0) {
      return res.status(404).json({ error: 'No stocks found for this farmer' });
    }

    res.json(stocks); // Return the available stocks for the farmer
  } catch (error) {
    console.error('Error fetching stocks:', error.message);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

// Route for farmers to sell crops (declaring crop, weight, and price)
router.post('/sell/:farmer_id', async (req, res) => {
  const { farmer_id } = req.params;
  const { crop, weight, price } = req.body;

  if (!crop || !weight || !price) {
    return res.status(400).json({ error: 'All fields (crop, weight, price) are required' });
  }

  try {
    // Check if the farmer has enough stock of the crop to sell
    const [stocks] = await db.query(`
      SELECT id, weight, price
      FROM yields
      WHERE farmer_id = ? AND crop = ?
    `, [farmer_id, crop]);

    if (stocks.length === 0) {
      return res.status(404).json({ error: 'No stock of this crop found for the farmer' });
    }

    const stock = stocks[0];

    // Log the stock and requested sale details for debugging
    console.log(`Farmer's stock for ${crop}:`, stock);  // Log stock for debugging
    console.log(`Farmer's stock weight: ${stock.weight}`);
    console.log(`Requested sale weight: ${weight}`);

    // Ensure weight and price are positive numbers and properly parsed
    const saleWeight = parseFloat(weight);
    const salePrice = parseFloat(price);

    if (isNaN(saleWeight) || saleWeight <= 0) {
      return res.status(400).json({ error: 'Invalid weight value' });
    }
    if (isNaN(salePrice) || salePrice <= 0) {
      return res.status(400).json({ error: 'Invalid price value' });
    }

    // Check if the farmer has enough stock to sell
    if (parseFloat(stock.weight) < saleWeight) {
      return res.status(400).json({ error: 'Not enough stock available to sell' });
    }

    console.log(`Farmer ${farmer_id} is selling ${saleWeight} units of ${crop} at ₹${salePrice} per unit`);

    // Deduct the weight from the farmer's stock in the yields table
    const updateStockResult = await db.query(`
      UPDATE yields
      SET weight = weight - ?
      WHERE farmer_id = ? AND crop = ?
    `, [saleWeight, farmer_id, crop]);

    if (updateStockResult.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to update stock for the farmer' });
    }

    // Insert a record into the sales table to track the sale (without `total_amount`)
    const saleResult = await db.query(`
      INSERT INTO sales (farmer_id, crop, weight, price)
      VALUES (?, ?, ?, ?)
    `, [farmer_id, crop, saleWeight, salePrice]);

    // Log the raw sale result object
    console.log('Sale insert result:', saleResult);

    // Check if the insertion was successful by accessing the result properly
    if (saleResult[0] && saleResult[0].insertId) {
      console.log(`Sale record inserted successfully: Sale ID: ${saleResult[0].insertId}`);
      return res.json({
        message: 'Sale successful',
        crop,
        weight: saleWeight,
        price: salePrice,
        remainingStock: stock.weight - saleWeight
      });
    } else {
      console.error('Error inserting sale record. No insertId found');
      return res.status(500).json({ error: 'Failed to insert sale record' });
    }

  } catch (error) {
    console.error('Error processing sale:', error.message);
    res.status(500).json({ error: 'Failed to process sale' });
  }
});

module.exports = router;