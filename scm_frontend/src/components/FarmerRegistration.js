import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, CircularProgress, Paper } from '@mui/material';

const FarmerRegistration = () => {
  const [formData, setFormData] = useState({ aadhaar: '', name: '' });
  const [walletDetails, setWalletDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setWalletDetails(null); // Clear previous wallet details
    setLoading(true); // Start loading

    try {
      const response = await axios.post('http://localhost:5001/api/farmers/register', formData);
      setWalletDetails(response.data); // Set wallet details on successful registration
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register farmer'); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: 'auto', textAlign: 'center', backgroundColor: '#f9f1ff', borderRadius: 2 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Farmer Registration
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Aadhaar"
          name="aadhaar"
          value={formData.aadhaar}
          onChange={handleChange}
          required
          fullWidth
          sx={{ mb: 2 }}
          variant="outlined"
        />
        <TextField
          label="Name"
          name="name"
          value={formData.name}
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
          {loading ? <CircularProgress size={24} color="primary" /> : 'Register'}
        </Button>
      </form>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          <strong>Error:</strong> {error}
        </Typography>
      )}

      {walletDetails && (
        <Paper sx={{ mt: 3, padding: 2, backgroundColor: '#e1bee7' }}>
          <Typography variant="h6" color="primary">
            Wallet Details
          </Typography>
          <Typography><strong>Public Key:</strong> {walletDetails.walletAddress}</Typography>
          <Typography><strong>Secret Key:</strong> {walletDetails.secretKey}</Typography>
          <Typography sx={{ fontSize: 'small', color: '#555' }}>
            <strong>Note:</strong> Save these details as they won't be displayed again. The secret key is sensitive and should not be shared.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default FarmerRegistration;