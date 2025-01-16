import React, { useState } from 'react';
import axios from 'axios';

const FarmerRegistration = () => {
  const [formData, setFormData] = useState({ aadhaar: '', name: '' });
  const [walletDetails, setWalletDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setWalletDetails(null); // Clear previous wallet details
    try {
      const response = await axios.post('http://localhost:5001/api/farmers/register', formData);
      setWalletDetails(response.data); // Set wallet details on successful registration
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register farmer'); // Set error message
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
      <h2>Farmer Registration</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="aadhaar"
            placeholder="Aadhaar"
            value={formData.aadhaar}
            onChange={handleChange}
            required
            style={{ padding: '10px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ padding: '10px', width: '100%' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Register
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {walletDetails && (
        <div style={{ textAlign: 'left', marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Wallet Details</h3>
          <p><strong>Public Key:</strong> {walletDetails.walletAddress}</p>
          <p>
            <strong>Secret Key:</strong> {walletDetails.secretKey}
          </p>
          <p style={{ fontSize: 'small', color: '#555' }}>
            <strong>Note:</strong> Save these details as it wont be displayed again. The secret key is sensitive and
            should not be shared with others.
          </p>
        </div>
      )}
    </div>
  );
};

export default FarmerRegistration;