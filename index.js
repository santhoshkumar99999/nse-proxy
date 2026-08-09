const express = require('express');
const { chromium } = require('playwright');
const app = express();

let context = null;

async function getContext() {
  if (context) return context;
  const browser = await chromium.launch();
  context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36'
  });
  return context;
}

app.get('/optionchain', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'NIFTY';
    const ctx = await getContext();
    const page = await ctx.newPage();
    await page.goto('https://www.nseindia.com', { waitUntil: 'domcontentloaded' });
    const response = await page.goto(`https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`);
    const json = await response.json();
    await page.close();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('NSE proxy is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
