import { BarChart3, LayoutGrid, Table2 } from 'lucide-react';

export const WIDGET_TYPES = [
  { id: 'card', label: 'Card', icon: LayoutGrid, description: 'Display key metrics' },
  { id: 'chart', label: 'Chart', icon: BarChart3, description: 'Visualize data trends' },
  { id: 'table', label: 'Table', icon: Table2, description: 'Tabular data view' },
];

export const REFRESH_INTERVALS = [
  { value: 0, label: 'Manual' },
  { value: 10000, label: '10s' },
  { value: 30000, label: '30s' },
  { value: 60000, label: '1m' },
  { value: 300000, label: '5m' },
  { value: 600000, label: '10m' },
];

export const PRESET_APIS = [
  {
    category: 'Custom',
    apis: [
      { name: 'Custom API', url: '', description: 'Enter your own API endpoint', types: ['card', 'chart', 'table'] },
    ],
  },
  {
    category: 'Alpha Vantage',
    apis: [
      { name: 'Stock Quote (IBM)', url: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=D2XAELWEY1SGFTVE', description: 'Real-time stock quote', types: ['card'] },
      { name: 'Stock Quote (AAPL)', url: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=D2XAELWEY1SGFTVE', description: 'Apple stock quote', types: ['card'] },
      { name: 'Time Series Daily', url: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=D2XAELWEY1SGFTVE', description: 'Daily OHLCV data', types: ['chart'] },
      { name: 'Time Series Intraday', url: 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=D2XAELWEY1SGFTVE', description: '5-min intraday data', types: ['chart'] },
      { name: 'Top Gainers/Losers', url: 'https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=D2XAELWEY1SGFTVE', description: 'Market movers', types: ['table'] },
      { name: 'Market News', url: 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=D2XAELWEY1SGFTVE', description: 'News & sentiment', types: ['table'] },
      { name: 'Company Overview', url: 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=D2XAELWEY1SGFTVE', description: 'Fundamental data', types: ['card', 'table'] },
      { name: 'Forex Rate (USD/EUR)', url: 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=D2XAELWEY1SGFTVE', description: 'Real-time forex', types: ['card'] },
      { name: 'Crypto (BTC/USD)', url: 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=D2XAELWEY1SGFTVE', description: 'Bitcoin price', types: ['card'] },
    ],
  },
  {
    category: 'Finnhub',
    apis: [
      { name: 'Stock Quote', url: 'https://finnhub.io/api/v1/quote?symbol=AAPL&token=demo', description: 'Real-time quote (replace token)', types: ['card'] },
      { name: 'Company Profile', url: 'https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=demo', description: 'Company info', types: ['card', 'table'] },
      { name: 'Market News', url: 'https://finnhub.io/api/v1/news?category=general&token=demo', description: 'General market news', types: ['table'] },
      { name: 'Company News', url: 'https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2024-01-01&to=2024-12-31&token=demo', description: 'Company-specific news', types: ['table'] },
      { name: 'Earnings Calendar', url: 'https://finnhub.io/api/v1/calendar/earnings?token=demo', description: 'Upcoming earnings', types: ['table'] },
      { name: 'IPO Calendar', url: 'https://finnhub.io/api/v1/calendar/ipo?token=demo', description: 'Upcoming IPOs', types: ['table'] },
      { name: 'Stock Peers', url: 'https://finnhub.io/api/v1/stock/peers?symbol=AAPL&token=demo', description: 'Similar companies', types: ['table'] },
      { name: 'Recommendation Trends', url: 'https://finnhub.io/api/v1/stock/recommendation?symbol=AAPL&token=demo', description: 'Analyst recommendations', types: ['chart', 'table'] },
    ],
  },
  {
    category: 'IndianAPI (NSE)',
    apis: [
      { name: 'NIFTY 50', url: 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050', description: 'NIFTY 50 constituents', types: ['table'] },
      { name: 'NIFTY Bank', url: 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20BANK', description: 'Bank NIFTY stocks', types: ['table'] },
      { name: 'Top Gainers', url: 'https://www.nseindia.com/api/live-analysis-variations?index=gainers', description: 'Top gaining stocks', types: ['table'] },
      { name: 'Top Losers', url: 'https://www.nseindia.com/api/live-analysis-variations?index=losers', description: 'Top losing stocks', types: ['table'] },
      { name: 'Option Chain (NIFTY)', url: 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY', description: 'NIFTY options data', types: ['table'] },
      { name: 'Option Chain (BANKNIFTY)', url: 'https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY', description: 'Bank NIFTY options', types: ['table'] },
      { name: 'Stock Quote (RELIANCE)', url: 'https://www.nseindia.com/api/quote-equity?symbol=RELIANCE', description: 'Reliance stock quote', types: ['card'] },
      { name: 'Stock Quote (TCS)', url: 'https://www.nseindia.com/api/quote-equity?symbol=TCS', description: 'TCS stock quote', types: ['card'] },
      { name: 'Market Status', url: 'https://www.nseindia.com/api/marketStatus', description: 'NSE market status', types: ['card'] },
      { name: 'NIFTY 50 Chart Data', url: 'https://www.nseindia.com/api/chart-databyindex?index=NIFTY%2050', description: 'Intraday chart data for NIFTY 50', types: ['chart'] },
      { name: 'BANKNIFTY Chart Data', url: 'https://www.nseindia.com/api/chart-databyindex?index=BANKNIFTY', description: 'Intraday chart data for BANKNIFTY', types: ['chart'] },
    ],
  },
  {
    category: 'Crypto (CoinGecko)',
    apis: [
      { name: 'Bitcoin Price', url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr&include_24hr_change=true', description: 'BTC price in USD & INR', types: ['card'] },
      { name: 'Top 10 Cryptos', url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1', description: 'Top coins by market cap', types: ['table'] },
      { name: 'Ethereum Price', url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr&include_24hr_change=true', description: 'ETH price with 24h change', types: ['card'] },
      { name: 'Bitcoin History (7D)', url: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7', description: '7-day price history for Chart', types: ['chart'] },
      { name: 'Trending Coins', url: 'https://api.coingecko.com/api/v3/search/trending', description: 'Trending on CoinGecko', types: ['table'] },
      { name: 'Global Market Data', url: 'https://api.coingecko.com/api/v3/global', description: 'Total market cap, volume', types: ['card'] },
    ],
  },
  {
    category: 'Exchange Rates',
    apis: [
      { name: 'USD Exchange Rates', url: 'https://api.exchangerate-api.com/v4/latest/USD', description: 'USD base rates', types: ['table', 'card'] },
      { name: 'INR Exchange Rates', url: 'https://api.exchangerate-api.com/v4/latest/INR', description: 'INR base rates', types: ['table', 'card'] },
      { name: 'EUR Exchange Rates', url: 'https://api.exchangerate-api.com/v4/latest/EUR', description: 'EUR base rates', types: ['table', 'card'] },
    ],
  },
  {
    category: 'Mock/Test APIs',
    apis: [
      { name: 'Sample Users', url: 'https://jsonplaceholder.typicode.com/users', description: 'Test user data', types: ['table'] },
      { name: 'Sample Posts', url: 'https://jsonplaceholder.typicode.com/posts', description: 'Test posts data', types: ['table'] },
      { name: 'Random Users', url: 'https://randomuser.me/api/?results=5', description: 'Random user generator', types: ['table'] },
    ],
  },
];
