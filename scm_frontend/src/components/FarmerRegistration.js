import React, { useState } from 'react';
import axios from 'axios';

const FarmerRegistration = () => {
  const [farmerData, setFarmerData] = useState({
    aadhaar: '',
    name: '',
    wallet: ''
  });

  const handleChange = (e) => {
    setFarmerData({ ...farmerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/farmers/register', farmerData);
      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering farmer');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Aadhaar:
        <input type="text" name="aadhaar" value={farmerData.aadhaar} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Name:
        <input type="text" name="name" value={farmerData.name} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Wallet Address:
        <input type="text" name="wallet" value={farmerData.wallet} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Register Farmer</button>
    </form>
  );
};

export default FarmerRegistration;