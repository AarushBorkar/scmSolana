const express = require('express');
const path = require('path');
const bs58 = require('bs58'); // Import Base58 encoding library
const router = express.Router();
const db = require('../db/connection');

// Dynamically resolve path to pubAndSecPairGen
const { generateKeypair } = require(path.resolve(
  __dirname,
  '../../../../solana-scm/dist/pubAndSecPairGen'
));

// Route: Get all farmers
router.get('/', async (req, res) => {
  try {
    const [farmers] = await db.query('SELECT * FROM farmers');
    res.json(farmers);
  } catch (error) {
    console.error('Error fetching farmers:', error.message);
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

// Route: Register a new farmer
router.post('/register', async (req, res) => {
  const { aadhaar, name } = req.body;

  // Validate input
  if (!aadhaar || !name) {
    return res.status(400).json({ error: 'Aadhaar and Name are required' });
  }

  try {
    // Generate wallet keypair
    const keypair = generateKeypair();
    const walletAddress = keypair.publicKey; // Public key in Base58 format
    const secretKeyArray = keypair.secretKey; // Secret key as a byte array

    // Convert the secret key array to a Base58-encoded string
    const secretKey = bs58.encode(secretKeyArray);

    // Save farmer details to the database
    await db.query(
      'INSERT INTO farmers (aadhaar, name, wallet, wallet_balance) VALUES (?, ?, ?, ?)',
      [aadhaar, name, walletAddress, 0]
    );

    // Respond with wallet details
    res.json({
      message: 'Farmer registered successfully',
      walletAddress,
      secretKey,
    });
  } catch (error) {
    console.error('Error registering farmer:', error.message);
    res.status(500).json({ error: 'Failed to register farmer' });
  }
});

module.exports = router;