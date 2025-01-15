import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/farmers');
        console.log('Fetched farmers:', response.data);
        setFarmers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching farmers:', error.message);
        setError('Failed to fetch farmers');
        setLoading(false);
      }
    };
  
    fetchFarmers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Registered Farmers</h2>
      <ul>
        {farmers.map((farmer) => (
          <li key={farmer.id}>
            {farmer.name} ({farmer.aadhaar}) - Wallet: {farmer.wallet}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FarmersList;