import React, { useState } from 'react';

const SellCrops = ({ farmerId, stocks }) => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [saleWeight, setSaleWeight] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSell = async () => {
    if (!selectedCrop || !saleWeight || !salePrice) {
      setError('Please fill all the fields.');
      return;
    }

    const saleData = {
      crop: selectedCrop,
      weight: saleWeight,
      price: salePrice,
    };

    try {
      const response = await fetch(`http://localhost:5001/api/sell/sell/${farmerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Sale successful: ${data.crop} sold!`);
        setError('');
      } else {
        setMessage('');
        setError(data.error || 'Failed to process sale');
      }
    } catch (err) {
      setMessage('');
      setError('Error processing sale');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Sell Crop</h1>

      {/* Select a crop from the available stocks */}
      <select
        value={selectedCrop}
        onChange={(e) => setSelectedCrop(e.target.value)}
      >
        <option value="">Select Crop</option>
        {stocks.map((stock) => (
          <option key={stock.id} value={stock.crop}>
            {stock.crop} - {stock.weight}kg available
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Enter weight to sell"
        value={saleWeight}
        onChange={(e) => setSaleWeight(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter price per unit"
        value={salePrice}
        onChange={(e) => setSalePrice(e.target.value)}
      />

      <button onClick={handleSell}>Sell</button>

      {/* Show success or error message */}
      {message && <div className="message">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default SellCrops;