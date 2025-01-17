import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress, Alert } from '@mui/material';

const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/farmers');
        setFarmers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch farmers');
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Registered Farmers
      </Typography>
      <Paper sx={{ padding: 2, backgroundColor: '#f1f1f1' }}>
        <List>
          {farmers.map((farmer) => (
            <ListItem key={farmer.id}>
              <ListItemText
                primary={`${farmer.name} (ID: ${farmer.id})`}
                secondary={`Wallet: ${farmer.wallet}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default FarmersList;