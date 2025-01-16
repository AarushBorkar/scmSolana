const express = require('express');
const bs58 = require('bs58');
const fs = require('fs');
const path = require('path');
const { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction 
} = require('@solana/web3.js');
const { 
  getOrCreateAssociatedTokenAccount, 
  createTransferInstruction 
} = require('@solana/spl-token');
const router = express.Router();
const db = require('../db/connection');

// Solana Devnet connection
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Load main wallet secret key
const secretKeyPath = path.resolve(__dirname, '../../dad6YRNQKc2Kq56gSubF1mcJ8JBmaWKJyQxr4T2AQt5.json');
const secretKeyArray = JSON.parse(fs.readFileSync(secretKeyPath, 'utf8'));
const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));

// Mint public key
const mintPublicKey = new PublicKey('mntGRyTT6RV4Xnk3jVvMWwiYVQUcmsibriacLpGtZBx'); // Replace with your actual mint address

// Route: Get all yields
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
    console.error('Error fetching yields:', error.message);
    res.status(500).json({ error: 'Failed to fetch yields' });
  }
});

// Route: Add a new yield entry
router.post('/add', async (req, res) => {
  const { farmer_id, crop, weight, price } = req.body;

  if (!farmer_id || !crop || !weight || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const tokensEarned = weight * price;
    if (tokensEarned <= 0) {
      return res.status(400).json({ error: 'Invalid token amount' });
    }

    // Fetch farmer wallet from the database
    const [farmer] = await db.query('SELECT wallet FROM farmers WHERE id = ?', [farmer_id]);
    if (!farmer.length) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    const farmerWallet = farmer[0].wallet;

    // Validate farmer wallet address
    try {
      bs58.decode(farmerWallet);
    } catch (err) {
      console.error('Invalid farmer wallet address:', farmerWallet, err.message);
      return res.status(400).json({ error: 'Invalid farmer wallet address' });
    }

    // Ensure main wallet's token account exists
    const mainTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payerKeypair,
      mintPublicKey,
      payerKeypair.publicKey
    );
    console.log('Main Wallet Token Account:', mainTokenAccount.address.toBase58());

    // Ensure farmer's token account exists
    const farmerTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payerKeypair,
      mintPublicKey,
      new PublicKey(farmerWallet)
    );
    console.log('Farmer Token Account:', farmerTokenAccount.address.toBase58());

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      mainTokenAccount.address, // Source token account
      farmerTokenAccount.address, // Destination token account
      payerKeypair.publicKey, // Authority
      tokensEarned * 10 ** 9 // Tokens in smallest unit (lamports)
    );

    // Create and send transaction
    const transaction = new Transaction().add(transferInstruction);
    const signature = await connection.sendTransaction(transaction, [payerKeypair]);
    await connection.confirmTransaction(signature);

    console.log('Transaction Signature:', signature);

    // Insert yield into the database
    await db.query(
      'INSERT INTO yields (farmer_id, crop, weight, price, tokens_earned) VALUES (?, ?, ?, ?, ?)',
      [farmer_id, crop, weight, price, tokensEarned]
    );

    res.json({
      message: 'Yield added and tokens transferred successfully',
      tokensEarned,
      signature,
    });
  } catch (error) {
    console.error('Error processing yield:', error.message || error);
    if (error.logs) {
      console.error('Transaction Logs:', error.logs);
    }
    res.status(500).json({
      error: 'Failed to add yield',
      details: error.message || 'Unknown error occurred',
    });
  }
});

module.exports = router;