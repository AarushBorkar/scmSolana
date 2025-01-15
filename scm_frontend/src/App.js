import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FarmersPage from './pages/FarmersPage';
import YieldsPage from './pages/YieldsPage';
import FarmersList from './components/FarmerList';
import YieldsList from './components/YieldList';
import YieldSubmission from './components/YieldSubmission'; // Import YieldSubmission

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/farmers" element={<FarmersPage />} />
        <Route path="/farmers/list" element={<FarmersList />} />
        <Route path="/yields" element={<YieldsPage />} />
        <Route path="/yields/list" element={<YieldsList />} />
        <Route path="/yields/submit" element={<YieldSubmission />} /> {/* Route for Yield Submission */}
      </Routes>
    </div>
  );
}

export default App;