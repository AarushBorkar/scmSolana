import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FarmersPage from './pages/FarmersPage';
import YieldsPage from './pages/YieldsPage';
import FarmersList from './components/FarmerList'; // Import FarmerList
import YieldsList from './components/YieldList'; // Import YieldList

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/farmers" element={<FarmersPage />} />
        <Route path="/farmers/list" element={<FarmersList />} /> {/* Route for Farmers List */}
        <Route path="/yields" element={<YieldsPage />} />
        <Route path="/yields/list" element={<YieldsList />} /> {/* Route for Yields List */}
      </Routes>
    </div>
  );
}

export default App;