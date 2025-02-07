import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, CircularProgress, Paper } from '@mui/material';

const SellCrops = ({ farmerId, stocks }) => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [saleWeight, setSaleWeight] = useState('');
  const [salePrice, setSalePrice] = useState(''); // Auto-filled based on crop selection
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokensToSend, setTokensToSend] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle crop selection and auto-fill price
  const handleCropChange = (e) => {
    const cropName = e.target.value;
    setSelectedCrop(cropName);

    // Find the selected crop in the stock list
    const selectedStock = stocks.find((stock) => stock.crop === cropName);
    if (selectedStock) {
      setSalePrice(selectedStock.price); // Auto-fill price
    } else {
      setSalePrice(''); // Reset price if no crop is found
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setTokensToSend(null);
    setLoading(true);

    const saleData = {
      crop: selectedCrop,
      weight: saleWeight,
      price: salePrice, // Use the pre-filled price
    };

    try {
      const response = await axios.post(`http://localhost:5001/api/sell/sell/${farmerId}`, saleData);
      const data = await response.data;

      if (response.status === 200) {
        setMessage(`Sale successful: ${data.crop} sold!`);
        setTokensToSend(data.tokensToSend);
      } else {
        setError(data.error || 'Failed to process sale');
      }
    } catch (err) {
      setError('Error processing sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: 'auto', textAlign: 'center', backgroundColor: '#f9f1ff', borderRadius: 2 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Sell Crop
      </Typography>

      <form onSubmit={handleSell}>
        {/* Crop selection */}
        <TextField
          label="Select Crop"
          value={selectedCrop}
          onChange={handleCropChange}
          required
          fullWidth
          sx={{ mb: 2 }}
          variant="outlined"
          select
          SelectProps={{
            native: true,
          }}
        >
          <option value="">Select Crop</option>
          {stocks.map((stock) => (
            <option key={stock.id} value={stock.crop}>
              {stock.crop} - {stock.weight}kg available
            </option>
          ))}
        </TextField>

        {/* Weight input */}
        <TextField
          label="Weight to Sell"
          type="number"
          value={saleWeight}
          onChange={(e) => setSaleWeight(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
          variant="outlined"
        />

        {/* Price input (read-only) */}
        <TextField
          label="Price per Unit"
          type="number"
          value={salePrice}
          readOnly
          fullWidth
          sx={{ mb: 2 }}
          variant="outlined"
        />

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2, padding: 1.5, fontSize: 16 }}
        >
          {loading ? <CircularProgress size={24} color="primary" /> : 'Sell'}
        </Button>
      </form>

      {message && (
        <Typography color="success" sx={{ mt: 2 }}>
          <strong>{message}</strong>
        </Typography>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          <strong>Error:</strong> {error}
        </Typography>
      )}

      {tokensToSend !== null && (
        <Paper sx={{ mt: 3, padding: 2, backgroundColor: '#e1bee7' }}>
          <Typography variant="h6" color="primary">
            Tokens to be sent:
          </Typography>
          <Typography>{tokensToSend} tokens</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SellCrops;