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
        console.log('Farmers fetched:', response.data); // Log data to check
        setFarmers(response.data);
      } catch (err) {
        setError('Error fetching farmers');
      } finally {
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