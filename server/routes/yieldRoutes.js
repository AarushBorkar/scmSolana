const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs'); // Import file system module
const bs58 = require('bs58');
const { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction,
  SystemProgram
} = require('@solana/web3.js');
const {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  Token
} = require('@solana/spl-token');
const router = express.Router();
const db = require('../db/connection');

// Solana Devnet connection
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Load main wallet secret key
const secretKeyPath = '/Users/aarush/keynew.js'; // Updated fee payer path
const secretKeyArray = JSON.parse(fs.readFileSync(secretKeyPath, 'utf8'));
const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));

// Mint public key (replace with your mint address)
const mintPublicKey = new PublicKey('mntGRyTT6RV4Xnk3jVvMWwiYVQUcmsibriacLpGtZBx'); 

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
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(farmerWallet)) {
      console.error('Invalid farmer wallet address:', farmerWallet);
      return res.status(400).json({ error: 'Invalid farmer wallet address' });
    }

    // SOL Transfer: 0.1 SOL to the farmer's ATA
    const receiverPublicKey = new PublicKey(farmerWallet);
    const transaction = new Transaction();
    
    // Add SOL transfer instruction (0.1 SOL)
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payerKeypair.publicKey, // sender (your main wallet)
        toPubkey: receiverPublicKey, // receiver's wallet (ATA)
        lamports: 0.1 * 10**9, // 0.1 SOL (1 SOL = 10^9 lamports)
      })
    );

    // Token Transfer: Send the tokens (already in your original logic)
    const cliCommand = `spl-token transfer ${mintPublicKey.toString()} ${tokensEarned} ${farmerWallet} --url https://api.devnet.solana.com --allow-unfunded-recipient --fee-payer "${secretKeyPath}" --fund-recipient`;

    console.log('Executing SOL and Token Transfer...');

    // Execute the CLI command for token transfer
    exec(cliCommand, async (error, stdout, stderr) => {
      if (error) {
        console.error('Error during token transfer:', stderr);
        return res.status(500).json({
          error: 'Failed to transfer tokens',
          details: stderr || 'Unknown error occurred',
        });
      }

      // Add both transactions (SOL + Token transfer) to the network
      try {
        const txHash = await connection.sendTransaction(transaction, [payerKeypair]);
        console.log('SOL Transfer Transaction Hash:', txHash);

        // Insert yield into the database
        await db.query(
          'INSERT INTO yields (farmer_id, crop, weight, price, tokens_earned) VALUES (?, ?, ?, ?, ?)',
          [farmer_id, crop, weight, price, tokensEarned]
        );

        res.json({
          message: 'Yield added successfully, tokens and SOL transferred',
          tokensEarned,
          transactionDetails: stdout,
          solTransactionHash: txHash,
        });
      } catch (solError) {
        console.error('Error during SOL transfer:', solError.message);
        return res.status(500).json({
          error: 'Failed to transfer SOL',
          details: solError.message || 'Unknown error occurred',
        });
      }
    });
  } catch (error) {
    console.error('Error processing yield:', error.message || error);
    res.status(500).json({
      error: 'Failed to add yield',
      details: error.message || 'Unknown error occurred',
    });
  }
});

module.exports = router;