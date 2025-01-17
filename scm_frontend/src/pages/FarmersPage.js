import React from 'react';
import FarmerRegistration from '../components/FarmerRegistration';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import framer-motion

const FarmersPage = () => {
  return (
    <div>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        Farmers Management
      </motion.h1>
      <FarmerRegistration />
      <br />
      <Link to="/farmers/list">View Registered Farmers</Link>
    </div>
  );
};

export default FarmersPage;