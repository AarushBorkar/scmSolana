import React, { useState } from 'react';
import axios from 'axios';

const YieldSubmission = () => {
  const [yieldData, setYieldData] = useState({
    aadhaar: '',
    crop: '',
    weight: '',
    price: ''
  });

  const handleChange = (e) => {
    setYieldData({ ...yieldData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/yields/submit', yieldData);
      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting yield');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Aadhaar:
        <input type="text" name="aadhaar" value={yieldData.aadhaar} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Crop:
        <input type="text" name="crop" value={yieldData.crop} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Weight (kg):
        <input type="number" name="weight" value={yieldData.weight} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Price (per kg):
        <input type="number" name="price" value={yieldData.price} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Submit Yield</button>
    </form>
  );
};

export default YieldSubmission;