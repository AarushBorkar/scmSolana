import React, { useState } from 'react';
import axios from 'axios';

const FarmerRegistration = () => {
  const [farmerData, setFarmerData] = useState({
    aadhaar: '',
    name: '',
    wallet: ''
  });

  const [statusMessage, setStatusMessage] = useState(''); // For success or error messages
  const [error, setError] = useState(null); // To display specific error messages

  const handleChange = (e) => {
    setFarmerData({ ...farmerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before making a request
    setStatusMessage(''); // Clear previous status

    // Input validation before making the request
    if (!/^\d{12}$/.test(farmerData.aadhaar)) {
      setError('Aadhaar must be a 12-digit number');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/farmers/register', farmerData);
      setStatusMessage(response.data.message || 'Farmer registered successfully!');
      setFarmerData({ aadhaar: '', name: '', wallet: '' }); // Clear form after success
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering farmer. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register Farmer</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Aadhaar:
          <input
            type="text"
            name="aadhaar"
            value={farmerData.aadhaar}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={farmerData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Wallet Address:
          <input
            type="text"
            name="wallet"
            value={farmerData.wallet}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Register Farmer</button>
      </form>
      {statusMessage && <p style={{ color: 'green' }}>{statusMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FarmerRegistration;