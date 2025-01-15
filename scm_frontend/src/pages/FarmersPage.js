import React from 'react';
import FarmerRegistration from '../components/FarmerRegistration';
import { Link } from 'react-router-dom';

const FarmersPage = () => {
  return (
    <div>
      <h1>Farmers Management</h1>
      <FarmerRegistration />
      <br />
      <Link to="/farmers/list">View Registered Farmers</Link> {/* Link to Farmers List */}
    </div>
  );
};

export default FarmersPage;