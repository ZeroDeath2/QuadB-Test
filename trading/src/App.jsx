/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Top10Tickers from './components/Top10Tickers';  // Import the tickers component

function App() {
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        console.log('Component mounted, fetching tickers...');
        const response = await fetch('http://localhost:3000/fetch-tickers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.text();
        console.log('Tickers fetched:', data);
      } catch (error) {
        console.error('Error fetching tickers:', error);
      }
    };

    fetchTickers();
  }, []);
  return (
    <div>
      <Top10Tickers />
    </div>
  );
}

export default App;
