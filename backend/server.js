// server.js
const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors'); // Import the cors package

//import keys for supabase from .env file
require('dotenv').config();


const app = express();
const port = 3000;

// Use the CORS middleware
app.use(cors());

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch top 10 tickers and store them in Supabase DB
app.get('/fetch-tickers', async (req, res) => {
  try {
    console.log('Fetching tickers...');
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    console.log('Response received:', response); // Log the entire response object

    if (response && response.data) {
      console.log('Response data:', response.data); // Log the response data
      const tickers = Object.values(response.data).slice(0, 10);
      console.log('Tickers:', tickers); // Log the tickers array

      // Delete all rows in the 'tickers' table
      const { error: deleteError } = await supabase
        .from('tickers')
        .delete()
        .neq('id', 0); // Use a condition that matches all rows

      if (deleteError) {
        console.error('Error deleting tickers:', deleteError);
        res.status(500).send('Error deleting tickers');
        return;
      }

      // Prepare data for insertion
      const tickerData = tickers.map(ticker => ({
        name: ticker.name,
        last: ticker.last,
        buy: ticker.buy,
        sell: ticker.sell,
        volume: ticker.volume,
        base_unit: ticker.base_unit,
      }));

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('tickers')
        .insert(tickerData);

      if (error) {
        console.error('Error inserting tickers:', error);
        res.status(500).send('Error inserting tickers');
      } else {
        res.send('Tickers stored in Supabase');
      }
    } else {
      console.error('No data received from API');
      res.status(500).send('No data received from API');
    }
  } catch (error) {
    console.error('Error fetching tickers:', error);
    res.status(500).send('Failed to fetch tickers');
  }
});

// Get tickers from Supabase DB and return to frontend
app.get('/get-tickers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tickers').select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    res.status(500).send('Error retrieving data');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});