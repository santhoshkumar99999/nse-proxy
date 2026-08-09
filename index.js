const express = require('express');
const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const app = express();
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.nseindia.com/option-chain'
};

app.get('/optionchain', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'NIFTY';
    await client.get('https://www.nseindia.com', { headers });
    await client.get('https://www.nseindia.com/option-chain', { headers });
    const response = await client.get(
      `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,
      { headers }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: err.response?.status });
  }
});

app.get('/', (req, res) => res.send('NSE proxy (lightweight) running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
