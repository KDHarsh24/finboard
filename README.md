#  FinBoard - Customizable Finance Dashboard

Hey there! Welcome to **FinBoard**, a powerful and fully customizable financial dashboard I built to help users track stocks, crypto, and market trends in real-time. 

The goal was to create something that feels professional yet is super easy to use—like a "Lego set" for finance data. You can drag, drop, resize, and build your own perfect market view.

---

## Live Demo & Video
> *Check out the live app and see it in action!*

- **Live Site:** https://hkdgrowwassignment.vercel.app/
- **Demo Video:** https://www.loom.com/share/29bcf6acd5e44c87a6c58249d2a79681

---

##  Key Features

###  **Interactive Widget Builder**
This is the heart of the app. I didn't want hardcoded widgets, so I built a dynamic **Widget Builder** that lets you:
- **Choose your style:** Cards for prices, Charts for trends, or Tables for lists.
- **Connect ANY API:** Use my presets (Alpha Vantage, Finnhub, CoinGecko, NSE) or paste your own custom API URL.
- **Visual Mapping:** A built-in JSON explorer lets you click on the data you want to show—no coding needed!

###  **Drag-and-Drop Grid**
- Organize your workspace exactly how you want.
- **Smart Layout:** Widgets snap into place automatically (3-column grid).
- **Resizeable:** Need a bigger chart? Just grab the corner and expand it.

###  **Real-Time & Robust**
- **Auto-Refresh:** Set widgets to update every 10s, 1m, or 5m.
- **CORS Proxy:** I built a custom internal proxy to bypass browser security restrictions, so you can fetch data from almost any external API without issues.
- **Data Persistence:** Your layout is saved automatically. Refresh the page, and everything is exactly where you left it using browser cache.


---

##  Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + Lucide Icons
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (with persistence)
- **Charts:** [Chart.js](https://www.chartjs.org/) & React-Chartjs-2
- **Grid System:** React-Grid-Layout
- **HTTP Client:** Axios

---

## Getting Started

Want to run this locally? Here's how:

1. **Clone the repo**
   ```bash
   git clone https://github.com/kdharsh24/finboard.git
   cd finboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Widget Testing Guide

The Widget Builder features **Smart Presets** that automatically filter available APIs based on the selected widget type. Here is how to test each type with specific examples.

### 1. Card Widget (Single Value)
*Best for: Current Price, Market Status, Portfolio Value*

**How to Test:**
1. Select **Card** widget type.
2. Open **Browse Presets** (filtered for Card-compatible APIs).
3. Select an API and click **Test API**.
4. In the JSON Explorer, click a value (e.g., `145.32`) and click **Add Field**.

**Examples:**
- **Stock Price (Alpha Vantage):**
  - Preset: `Stock Quote (IBM)`
  - Map: `Global Quote` -> `05. price`
- **Crypto Price (CoinGecko):**
  - Preset: `Bitcoin Price`
  - Map: `bitcoin` -> `usd`
- **Market Status (NSE):**
  - Preset: `Market Status`
  - Map: `marketState` -> `0` -> `marketStatus`
- **Forex Rate (Alpha Vantage):**
  - Preset: `Forex Rate (USD/EUR)`
  - Map: `Realtime Currency Exchange Rate` -> `5. Exchange Rate`

### 2. Chart Widget (Time Series)
*Best for: Price History, Trends, Analytics*

**How to Test:**
1. Select **Chart** widget type.
2. Open **Browse Presets** (filtered for Chart-compatible APIs).
3. Select an API and click **Test API**.
4. Set **Data Array Path** (the list of data points).
5. Select **X-Axis** (Time/Label) and **Y-Axis** (Value) fields.

**Examples:**
- **Bitcoin History (CoinGecko):**
  - Preset: `Bitcoin History (7D)`
  - Root Path: `prices`
  - X-Axis: `0` (Timestamp)
  - Y-Axis: `1` (Price)
- **Stock History (Alpha Vantage):**
  - Preset: `Time Series Daily`
  - Root Path: `Time Series (Daily)`
  - Y-Axis: `4. close` (X-Axis auto-detected from keys)
- **Recommendation Trends (Finnhub):**
  - Preset: `Recommendation Trends`
  - Root Path: `(root array)`
  - X-Axis: `period`
  - Y-Axis: `buy`

### 3. Table Widget (List of Items)
*Best for: Top Lists, News, Portfolios*

**How to Test:**
1. Select **Table** widget type.
2. Open **Browse Presets** (filtered for Table-compatible APIs).
3. Select an API and click **Test API**.
4. Set **Data Array Path** (the list of items).
5. Click **Add Column** for each field you want to show.

**Examples:**
- **Top Cryptos (CoinGecko):**
  - Preset: `Top 10 Cryptos`
  - Root Path: `(root array)`
  - Columns: `name`, `current_price`, `price_change_percentage_24h`
- **Market News (Finnhub):**
  - Preset: `Market News`
  - Root Path: `(root array)`
  - Columns: `headline`, `source`, `datetime`
- **Top Gainers (NSE):**
  - Preset: `Top Gainers`
  - Root Path: `data`
  - Columns: `symbol`, `ltp`, `perChange`

---

## 🔮 Future Improvements
If I had more time, I'd love to add:
- **Authentication:** Save user layouts to a database (Firebase/Supabase).
- **More Chart Types:** Candlestick charts for advanced trading views.
- **Alerts:** Browser notifications when a stock hits a certain price.

---


## API Exploration — What I tried and learned

I couldn't complete a full, exhaustive API exploration due to time and CORS limitations, but I focused my efforts on three providers and learned how they fit the dashboard use-cases:

- **Alpha Vantage**
   - Best for single-point financial data and fundamental/company information (Global Quote, Time Series daily/intraday, Overview).
   - Requires an API key (free tier available). Good for Cards (single metrics) and basic Charts when using time series endpoints.
   - Note: rate limits are strict (per-minute/day), so cache results and avoid frequent polling in production.

- **CoinGecko**
   - Excellent for crypto data and the easiest to use (no API key required). Provides both simple price endpoints and historical market charts.
   - Great for Chart widgets (e.g., `market_chart` for 7-day price arrays) and Card widgets for current price/24h change.
   - Works well for quick testing and demonstrations.

- **Indian NSE / IndianAPI**
   - Useful for Indian market-specific endpoints (top gainers/losers, option chains, index constituents).
   - Often has CORS or blocking behavior from the site; using the project's internal proxy helps but consider a server-side fetch for reliability.
   - Best used for Table widgets (lists of stocks, option chains) and market-status cards.

### Practical notes / recommendations

- Use the internal `/api/proxy` when testing endpoints that block direct browser requests — this solves many CORS errors.
- For Charts prefer array-based historical endpoints (CoinGecko `prices` or Alpha Vantage time series). Map `timestamps` to X and `values` to Y in the builder.
- For Tables, identify the root array (e.g., `data`, `rows`, `prices`) in the explorer and set it as the Data Array Path; then add columns from a sample item.

If you'd like, I can continue exploring additional endpoints (Finnhub, IEX Cloud, TwelveData) and add ready-to-use presets and example mappings for each.
