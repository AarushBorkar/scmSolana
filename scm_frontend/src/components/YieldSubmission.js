import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, CircularProgress, Paper } from '@mui/material';

const YieldSubmission = () => {
  const [yieldData, setYieldData] = useState({
    farmer_id: '',
    crop: '',
    weight: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setYieldData({ ...yieldData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      const response = await axios.post(
        'http://localhost:5001/api/yields/add',
        yieldData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert(response.data.message);
      setYieldData({ farmer_id: '', crop: '', weight: '', price: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting yield');
      alert(err.response?.data?.error || 'Error submitting yield');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: 'auto', textAlign: 'center', backgroundColor: '#f9f1ff', borderRadius: 2 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Submit Your Yield
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Farmer ID"
          name="farmer_id"
          value={yieldData.farmer_id}
          onChange={handleChange}
          required
          fullWidth
          sx={{ mb: 2 }}
          variant="outlined"
        />
        <TextField
          label="Crop"
          name="crop"
          value={yieldData.crop}
          onChange={handleChange}
          required
          fullWidth
          sx={{ mb: 2 }}
          variant="outlined"
        />
        <TextField
          label="Weight (kg)"
          name="weight"
          type="number"
          value={yieldData.weight}
          onChange={handleChange}
          required
          fullWidth
          sx={{ mb: 2 }}
          variant="outlined"
        />
        <TextField
          label="Price (₹/kg)"
          name="price"
          type="number"
          value={yieldData.price}
          onChange={handleChange}
          required
          fullWidth
          sx={{ mb: 2 }}
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2, padding: 1.5, fontSize: 16 }}
        >
          {loading ? <CircularProgress size={24} color="primary" /> : 'Submit Yield'}
        </Button>
      </form>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          <strong>Error:</strong> {error}
        </Typography>
      )}
    </Box>
  );
};

export default YieldSubmission;