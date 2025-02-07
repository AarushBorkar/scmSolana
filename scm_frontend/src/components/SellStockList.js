import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const SellStockList = ({ onStocksFetched, setFarmerId }) => {
  const [farmerId, setLocalFarmerId] = useState('');
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the stocks for the given farmer_id
  const fetchStocks = async () => {
    setLoading(true);
    try {
      if (!farmerId) {
        setError('Please enter a valid farmer ID.');
        setLoading(false);
        return;
      }

      // Set the farmerId in parent component
      setFarmerId(farmerId);

      const response = await fetch(`http://localhost:5001/api/sell/stocks/${farmerId}`);
      const data = await response.json();

      if (response.ok) {
        setStocks(data);
        setError('');
        onStocksFetched(data); // Pass the stocks back to parent
      } else {
        setError(data.error || 'Failed to fetch stocks');
        setStocks([]);
      }
    } catch (err) {
      setError('Error fetching stocks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: 'auto', textAlign: 'center', backgroundColor: '#f9f1ff', borderRadius: 2 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Sell Stock
      </Typography>

      {/* Input and button for fetching stocks */}
      <div className="form-group">
        <TextField
          label="Enter Farmer ID"
          value={farmerId}
          onChange={(e) => setLocalFarmerId(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={fetchStocks}
          fullWidth
          sx={{ padding: 1.5, fontSize: 16 }}
        >
          {loading ? <CircularProgress size={24} color="primary" /> : 'Get Stocks'}
        </Button>
      </div>

      {/* Error message */}
      {error && <Typography color="error" sx={{ mt: 2 }}><strong>Error:</strong> {error}</Typography>}

      {/* Display stocks if available */}
      {stocks.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6" color="primary">Crop</Typography></TableCell>
                <TableCell><Typography variant="h6" color="primary">Weight</Typography></TableCell>
                <TableCell><Typography variant="h6" color="primary">Price</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.crop}</TableCell>
                  <TableCell>{stock.weight}</TableCell>
                  <TableCell>{stock.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SellStockList;