import React, { useState } from 'react';
import axios from 'axios';

const YieldSubmission = () => {
  const [yieldData, setYieldData] = useState({
    farmer_id: '',
    crop: '',
    weight: '',
    price: '',
  });

  const handleChange = (e) => {
    setYieldData({ ...yieldData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting yield data:', yieldData);

    try {
      const response = await axios.post(
        'http://localhost:5001/api/yields/add',
        yieldData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert(response.data.message);
      setYieldData({ farmer_id: '', crop: '', weight: '', price: '' });
    } catch (err) {
      console.error('Error submitting yield:', err.response?.data?.error || err.message);
      alert(err.response?.data?.error || 'Error submitting yield');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Farmer ID:
        <input
          type="text"
          name="farmer_id"
          value={yieldData.farmer_id}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Crop:
        <input
          type="text"
          name="crop"
          value={yieldData.crop}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Weight (kg):
        <input
          type="number"
          name="weight"
          value={yieldData.weight}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Price (₹/kg):
        <input
          type="number"
          name="price"
          value={yieldData.price}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <button type="submit">Submit Yield</button>
    </form>
  );
};

export default YieldSubmission;