import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Submitted Yields</h2>
      <ul>
        {yields.map((yieldEntry) => (
          <li key={yieldEntry.id}>
            Farmer ID: {yieldEntry.farmer_id}, Crop: {yieldEntry.crop},
            Weight: {yieldEntry.weight}kg, Price: ₹{yieldEntry.price}/kg,
            Tokens Earned: {yieldEntry.tokens_earned}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YieldsList;