import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Paper } from '@mui/material';

const YieldsList = () => {
  const [yields, setYields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYields = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/yields');
        setYields(response.data);
      } catch (err) {
        setError('Error fetching yields');
      } finally {
        setLoading(false);
      }
    };

    fetchYields();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: '800px', margin: 'auto', mt: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Submitted Yields
      </Typography>
      <Paper sx={{ padding: 2, backgroundColor: '#f7f1f8' }}>
        <List>
          {yields.map((yieldEntry) => (
            <ListItem
              key={yieldEntry.id}
              sx={{
                mb: 2,
                border: '1px solid #9c27b0',
                borderRadius: 2,
                padding: 2,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 4px 15px rgba(156, 39, 176, 0.2)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <ListItemText
                primary={`Farmer Name: ${yieldEntry.farmer_name}`}
                secondary={`Crop: ${yieldEntry.crop}, Weight: ${yieldEntry.weight}kg, Price: ₹${yieldEntry.price}/kg, Tokens Earned: ${yieldEntry.tokens_earned}`}
                sx={{ fontWeight: 'bold', color: '#9c27b0' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default YieldsList;