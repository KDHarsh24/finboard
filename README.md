#  FinBoard - Customizable Finance Dashboard

Hey there! Welcome to **FinBoard**, a powerful and fully customizable financial dashboard I built to help users track stocks, crypto, and market trends in real-time. 

The goal was to create something that feels professional yet is super easy to use—like a "Lego set" for finance data. You can drag, drop, resize, and build your own perfect market view.

---

## Live Demo & Video
> *Check out the live app and see it in action!*

- **Live Site:** [Insert Vercel/Netlify Link Here]
- **Demo Video:** [Insert YouTube/Loom Link Here]

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
- **Data Persistence:** Your layout is saved automatically. Refresh the page, and everything is exactly where you left it.


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

## 📚 How to Use

### 1. Adding a Stock Price (Card)
- Click **"+ Add Widget"**.
- Select **Card**.
- Choose **Alpha Vantage** -> **Stock Quote**.
- Click **Test API**.
- In the explorer, click the `price` field and hit **"Add Field"**.
- Save it!

### 2. Adding a History Chart
- Click **"+ Add Widget"**.
- Select **Chart**.
- Choose **Crypto** -> **Bitcoin History (7D)**.
- The builder automatically maps the X-axis (Time) and Y-axis (Price).
- Save it to see a beautiful trend line!

### 3. Adding a Market Table
- Click **"+ Add Widget"**.
- Select **Table**.
- Choose **IndianAPI** -> **Top Gainers**.
- Select the `data` array and pick columns like `symbol` and `LTP`.
- Save it to see a sortable list.

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
