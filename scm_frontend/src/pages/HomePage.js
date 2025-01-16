import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Stack, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h4" gutterBottom>
        Welcome to SCM Solana
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        A supply chain management platform powered by Solana blockchain.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
        <Button variant="contained" color="primary" component={Link} to="/farmers/register">
          Register Farmer
        </Button>
        <Button variant="contained" color="secondary" component={Link} to="/yields/submit">
          Submit Yield
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/yields/list">
          View Yields
        </Button>
      </Stack>
    </Box>
  );
};

export default HomePage;