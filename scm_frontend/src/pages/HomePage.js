import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Stack, Box } from '@mui/material';
import { motion } from 'framer-motion'; // Import framer-motion

const HomePage = () => {
  return (
    <Box textAlign="center" mt={5}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to SCM Solana
        </Typography>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          A supply chain management platform powered by Solana blockchain.
        </Typography>
      </motion.div>

      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
        <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1 }}>
          <Button variant="contained" color="secondary" component={Link} to="/farmers">
            Register Farmer
          </Button>
        </motion.div>

        <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
          <Button variant="contained" color="primary" component={Link} to="/yields">
            Submit Yield
          </Button>
        </motion.div>

        {/* <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
          <Button variant="contained" color="secondary" component={Link} to="/yields/list">
            View Yields
          </Button>
        </motion.div> */}

        <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.6 }}>
          <Button variant="contained" color="primary" component={Link} to="/sell">
            Sell Crops
          </Button>
        </motion.div>

        <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.6 }}>
        <Button variant="contained" color="secondary" component={Link} to="/vendors">
        Find Vendors
        </Button>
        </motion.div>
      </Stack>
    </Box>
  );
};

export default HomePage;