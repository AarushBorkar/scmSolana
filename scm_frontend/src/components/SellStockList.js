import React, { useState } from 'react';

const SellStockList = ({ onStocksFetched, setFarmerId }) => {
  const [farmerId, setLocalFarmerId] = useState('');
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState('');

  // Fetch the stocks for the given farmer_id
  const fetchStocks = async () => {
    try {
      if (!farmerId) {
        setError('Please enter a valid farmer ID.');
        return;
      }

      // Set the farmerId in parent component
      setFarmerId(farmerId);

      const response = await fetch(`http://localhost:5001/api/sell/stocks/${farmerId}`);
      const data = await response.json();

      if (response.ok) {
        setStocks(data);
        setError('');
        onStocksFetched(data);  // Pass the stocks back to parent
      } else {
        setError(data.error || 'Failed to fetch stocks');
        setStocks([]);
      }
    } catch (err) {
      setError('Error fetching stocks.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Sell Stock</h1>

      {/* Prompt for farmer id */}
      <input
        type="text"
        placeholder="Enter Farmer ID"
        value={farmerId}
        onChange={(e) => setLocalFarmerId(e.target.value)}
      />
      <button onClick={fetchStocks}>Get Stocks</button>

      {error && <div className="error">{error}</div>}

      {/* Show the stocks if they are available */}
      {stocks.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Crop</th>
              <th>Weight</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id}>
                <td>{stock.crop}</td>
                <td>{stock.weight}</td>
                <td>{stock.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellStockList;