const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const farmerRoutes = require('./routes/farmerRoutes');
const yieldRoutes = require('./routes/yieldRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/farmers', farmerRoutes);  // For accessing farmer routes
app.use('/api/yields', yieldRoutes);    // For accessing yield routes

app.get('/', (req, res) => {
  res.send('Welcome to the Supply Chain Management API!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});