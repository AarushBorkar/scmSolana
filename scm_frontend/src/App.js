import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container } from '@mui/material';
import HomePage from './pages/HomePage';
import FarmersPage from './pages/FarmersPage';
import YieldsPage from './pages/YieldsPage';
import FarmersList from './components/FarmerList';
import YieldsList from './components/YieldList';
import YieldSubmission from './components/YieldSubmission';
import FarmerRegistration from './components/FarmerRegistration';

function App() {
  return (
    <div className="App">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SCM Solana
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/farmers">
            Farmers
          </Button>
          <Button color="inherit" component={Link} to="/farmers/list">
            Farmer List
          </Button>
          <Button color="inherit" component={Link} to="/yields">
            Yields
          </Button>
          <Button color="inherit" component={Link} to="/yields/list">
            Yield List
          </Button>
          <Button color="inherit" component={Link} to="/yields/submit">
            Submit Yield
          </Button>
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
  );
}

export default App;