import React, { useState } from 'react';
import SellStockList from '../components/SellStockList';
import SellCrops from '../components/SellCrops';

const SellPage = () => {
  const [stocks, setStocks] = useState([]);
  const [farmerId, setFarmerId] = useState('');

  // This function will be called once stocks are fetched
  const handleStocksFetched = (stocks) => {
    setStocks(stocks);
  };

  return (
    <div>
      <h1>Sell Crops</h1>

      {/* First, ask for the farmer ID */}
      <SellStockList onStocksFetched={handleStocksFetched} setFarmerId={setFarmerId} />

      {/* Once stocks are fetched, show SellCrops */}
      {stocks.length > 0 && (
        <SellCrops farmerId={farmerId} stocks={stocks} />
      )}
    </div>
  );
};

export default SellPage;