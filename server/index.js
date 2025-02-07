const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Import Routes
const farmerRoutes = require('./routes/farmerRoutes');
const yieldRoutes = require('./routes/yieldRoutes');
const sellRoutes = require('./routes/sellRoutes'); // Add this line for the new sell routes

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// Define Routes
app.use('/api/farmers', farmerRoutes); // Farmer routes
app.use('/api/yields', yieldRoutes);   // Yield routes
app.use('/api/sell', sellRoutes);      // Add this line for the sell routes

// Health Check or Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to the Supply Chain Management API!');
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});