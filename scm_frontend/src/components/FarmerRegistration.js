import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const FarmerRegistration = () => {
  const [farmerData, setFarmerData] = useState({
    aadhaar: '',
    name: '',
    wallet: '',
  });

  const handleChange = (e) => {
    setFarmerData({ ...farmerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/farmers/register', farmerData);
      alert(response.data.message);
      setFarmerData({ aadhaar: '', name: '', wallet: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering farmer');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Farmer Registration
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Aadhaar"
            name="aadhaar"
            value={farmerData.aadhaar}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Name"
            name="name"
            value={farmerData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Wallet Address"
            name="wallet"
            value={farmerData.wallet}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register Farmer
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default FarmerRegistration;