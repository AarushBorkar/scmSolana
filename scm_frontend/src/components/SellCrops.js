import React, { useState } from 'react';

const SellCrops = ({ farmerId, stocks }) => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [saleWeight, setSaleWeight] = useState('');
  const [salePrice, setSalePrice] = useState(''); // Auto-filled based on crop selection
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokensToSend, setTokensToSend] = useState(null);

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

  const handleSell = async () => {
    if (!selectedCrop || !saleWeight) {
      setError('Please fill all the fields.');
      return;
    }

    const saleData = {
      crop: selectedCrop,
      weight: saleWeight,
      price: salePrice, // Use the pre-filled price
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
        setTokensToSend(data.tokensToSend);
        setError('');
      } else {
        setMessage('');
        setTokensToSend(null);
        setError(data.error || 'Failed to process sale');
      }
    } catch (err) {
      setMessage('');
      setTokensToSend(null);
      setError('Error processing sale');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Sell Crop</h1>

      {/* Select a crop from the available stocks */}
      <select value={selectedCrop} onChange={handleCropChange}>
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

      {/* Price input is now auto-filled and read-only */}
      <input
        type="number"
        placeholder="Price per unit"
        value={salePrice}
        readOnly
      />

      <button onClick={handleSell}>Sell</button>

      {/* Show success or error message */}
      {message && <div className="message">{message}</div>}
      {error && <div className="error">{error}</div>}

      {/* Show tokens required for transaction */}
      {tokensToSend !== null && (
        <div className="tokens-info">
          <strong>Tokens to be sent:</strong> {tokensToSend} tokens
        </div>
      )}
    </div>
  );
};

export default SellCrops;