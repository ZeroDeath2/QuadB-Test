/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Top10Tickers.css';  // Add some CSS for styling if needed

function Top10Tickers() {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickers data from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3000/get-tickers')  // Backend API route
      .then(response => {
        setTickers(response.data);  // Store the received data in state
        setLoading(false);          // Data loaded successfully
        console.log('Tickers:', response.data);  // Log the data to the console
      })
      .catch(error => {
        console.error('Error fetching tickers:', error);
        setError('Error fetching data');
        setLoading(false);           // Stop loading in case of an error
      });
  }, []);

  // Conditionally render based on state (loading, error, or data)
  if (loading) return <div>Loading tickers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Top 10 Tickers</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Price</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Volume</th>
            <th>Base Unit</th>
          </tr>
        </thead>
        <tbody>
          {tickers.map((ticker, index) => (
            <tr key={index}>
              <td>{ticker.name}</td>
              <td>{ticker.last}</td>
              <td>{ticker.buy}</td>
              <td>{ticker.sell}</td>
              <td>{ticker.volume}</td>
              <td>{ticker.base_unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Top10Tickers;
