import React from 'react';
import YieldSubmission from '../components/YieldSubmission';
import { Link } from 'react-router-dom';

const YieldsPage = () => {
  return (
    <div>
      <h1>Submit Your Yields</h1>
      <YieldSubmission />
      <br />
      <Link to="/yields/list">View Submitted Yields</Link> {/* Link to Yields List */}
    </div>
  );
};

export default YieldsPage;