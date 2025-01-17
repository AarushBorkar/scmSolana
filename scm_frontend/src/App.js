import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion'; // Import framer-motion for animation
import HomePage from './pages/HomePage';
import FarmersPage from './pages/FarmersPage';
import YieldsPage from './pages/YieldsPage';
import FarmersList from './components/FarmerList';
import YieldsList from './components/YieldList';
import YieldSubmission from './components/YieldSubmission';
import FarmerRegistration from './components/FarmerRegistration';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0', // Purple
    },
    secondary: {
      main: '#e91e63', // Pink
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              SCM Solana
            </Typography>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <Button color="inherit" component={Link} to="/farmers">
                Farmers
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <Button color="inherit" component={Link} to="/yields">
                Yields
              </Button>
            </motion.div>
          </Toolbar>
        </AppBar>
        <Container sx={{ marginTop: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/farmers" element={<FarmersPage />} />
            <Route path="/farmers/list" element={<FarmersList />} />
            <Route path="/yields" element={<YieldsPage />} />
            <Route path="/yields/list" element={<YieldsList />} />
            <Route path="/yields/submit" element={<YieldSubmission />} />
            <Route path="/farmers/register" element={<FarmerRegistration />} />
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;