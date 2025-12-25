'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useDashboardStore } from '@/store/dashboardStore';
import JsonExplorer from '@/components/ui/JsonExplorer';
import { X, Zap, Clock, CheckCircle2, XCircle, BarChart3, LayoutGrid, Table2, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';

const WIDGET_TYPES = [
  { id: 'card', label: 'Card', icon: LayoutGrid, description: 'Display key metrics' },
  { id: 'chart', label: 'Chart', icon: BarChart3, description: 'Visualize data trends' },
  { id: 'table', label: 'Table', icon: Table2, description: 'Tabular data view' },
];

const REFRESH_INTERVALS = [
  { value: 0, label: 'Manual' },
  { value: 10000, label: '10s' },
  { value: 30000, label: '30s' },
  { value: 60000, label: '1m' },
  { value: 300000, label: '5m' },
  { value: 600000, label: '10m' },
];

const PRESET_APIS = [
  {
    category: 'Custom',
    apis: [
      { name: 'Custom API', url: '', description: 'Enter your own API endpoint' },
    ],
  },
  {
    category: 'Alpha Vantage',
    apis: [
      { name: 'Stock Quote (IBM)', url: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=D2XAELWEY1SGFTVE', description: 'Real-time stock quote' },
      { name: 'Stock Quote (AAPL)', url: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=D2XAELWEY1SGFTVE', description: 'Apple stock quote' },
      { name: 'Time Series Daily', url: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=D2XAELWEY1SGFTVE', description: 'Daily OHLCV data' },
      { name: 'Time Series Intraday', url: 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=D2XAELWEY1SGFTVE', description: '5-min intraday data' },
      { name: 'Top Gainers/Losers', url: 'https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=D2XAELWEY1SGFTVE', description: 'Market movers' },
      { name: 'Market News', url: 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=D2XAELWEY1SGFTVE', description: 'News & sentiment' },
      { name: 'Company Overview', url: 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=D2XAELWEY1SGFTVE', description: 'Fundamental data' },
      { name: 'Forex Rate (USD/EUR)', url: 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=D2XAELWEY1SGFTVE', description: 'Real-time forex' },
      { name: 'Crypto (BTC/USD)', url: 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=D2XAELWEY1SGFTVE', description: 'Bitcoin price' },
    ],
  },
  {
    category: 'Finnhub',
    apis: [
      { name: 'Stock Quote', url: 'https://finnhub.io/api/v1/quote?symbol=AAPL&token=demo', description: 'Real-time quote (replace token)' },
      { name: 'Company Profile', url: 'https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=demo', description: 'Company info' },
      { name: 'Market News', url: 'https://finnhub.io/api/v1/news?category=general&token=demo', description: 'General market news' },
      { name: 'Company News', url: 'https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2024-01-01&to=2024-12-31&token=demo', description: 'Company-specific news' },
      { name: 'Earnings Calendar', url: 'https://finnhub.io/api/v1/calendar/earnings?token=demo', description: 'Upcoming earnings' },
      { name: 'IPO Calendar', url: 'https://finnhub.io/api/v1/calendar/ipo?token=demo', description: 'Upcoming IPOs' },
      { name: 'Stock Peers', url: 'https://finnhub.io/api/v1/stock/peers?symbol=AAPL&token=demo', description: 'Similar companies' },
      { name: 'Recommendation Trends', url: 'https://finnhub.io/api/v1/stock/recommendation?symbol=AAPL&token=demo', description: 'Analyst recommendations' },
    ],
  },
  {
    category: 'IndianAPI (NSE)',
    apis: [
      { name: 'NIFTY 50', url: 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050', description: 'NIFTY 50 constituents' },
      { name: 'NIFTY Bank', url: 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20BANK', description: 'Bank NIFTY stocks' },
      { name: 'Top Gainers', url: 'https://www.nseindia.com/api/live-analysis-variations?index=gainers', description: 'Top gaining stocks' },
      { name: 'Top Losers', url: 'https://www.nseindia.com/api/live-analysis-variations?index=losers', description: 'Top losing stocks' },
      { name: 'Option Chain (NIFTY)', url: 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY', description: 'NIFTY options data' },
      { name: 'Option Chain (BANKNIFTY)', url: 'https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY', description: 'Bank NIFTY options' },
      { name: 'Stock Quote (RELIANCE)', url: 'https://www.nseindia.com/api/quote-equity?symbol=RELIANCE', description: 'Reliance stock quote' },
      { name: 'Stock Quote (TCS)', url: 'https://www.nseindia.com/api/quote-equity?symbol=TCS', description: 'TCS stock quote' },
      { name: 'Market Status', url: 'https://www.nseindia.com/api/marketStatus', description: 'NSE market status' },
    ],
  },
  {
    category: 'Crypto (CoinGecko)',
    apis: [
      { name: 'Bitcoin Price', url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr&include_24hr_change=true', description: 'BTC price in USD & INR' },
      { name: 'Top 10 Cryptos', url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1', description: 'Top coins by market cap' },
      { name: 'Ethereum Price', url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr&include_24hr_change=true', description: 'ETH price with 24h change' },
      { name: 'Bitcoin History (7D)', url: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7', description: '7-day price history for Chart' },
      { name: 'Trending Coins', url: 'https://api.coingecko.com/api/v3/search/trending', description: 'Trending on CoinGecko' },
      { name: 'Global Market Data', url: 'https://api.coingecko.com/api/v3/global', description: 'Total market cap, volume' },
    ],
  },
  {
    category: 'Exchange Rates',
    apis: [
      { name: 'USD Exchange Rates', url: 'https://api.exchangerate-api.com/v4/latest/USD', description: 'USD base rates' },
      { name: 'INR Exchange Rates', url: 'https://api.exchangerate-api.com/v4/latest/INR', description: 'INR base rates' },
      { name: 'EUR Exchange Rates', url: 'https://api.exchangerate-api.com/v4/latest/EUR', description: 'EUR base rates' },
    ],
  },
  {
    category: 'Mock/Test APIs',
    apis: [
      { name: 'Sample Users', url: 'https://jsonplaceholder.typicode.com/users', description: 'Test user data' },
      { name: 'Sample Posts', url: 'https://jsonplaceholder.typicode.com/posts', description: 'Test posts data' },
      { name: 'Random Users', url: 'https://randomuser.me/api/?results=5', description: 'Random user generator' },
    ],
  },
];

const WidgetBuilder = ({ onClose, initialWidget }) => {
  const addWidget = useDashboardStore((state) => state.addWidget);
  const updateWidget = useDashboardStore((state) => state.updateWidget);
  const isDarkMode = useDashboardStore((state) => state.isDarkMode);

  const [config, setConfig] = useState({
    type: initialWidget?.type || 'card',
    title: initialWidget?.title || '',
    url: initialWidget?.config?.url || '',
    method: initialWidget?.config?.method || 'GET',
    interval: initialWidget?.config?.interval || 60000,
  });

  const [showPresets, setShowPresets] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [apiMeta, setApiMeta] = useState(null); // { status, statusText, time, headers }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  // Mappings
  const [cardMappings, setCardMappings] = useState(() => {
    if (initialWidget?.type === 'card' && initialWidget.config.mapping) {
        return Object.entries(initialWidget.config.mapping).map(([label, path]) => ({ label, path }));
    }
    return [];
  });
  const [chartMapping, setChartMapping] = useState(() => {
    if (initialWidget?.type === 'chart' && initialWidget.config.mapping) {
        return initialWidget.config.mapping;
    }
    return { rootPath: '', xKey: '', yKey: '' };
  });
  const [tableMapping, setTableMapping] = useState(() => {
    if (initialWidget?.type === 'table' && initialWidget.config.mapping) {
        return initialWidget.config.mapping;
    }
    return { rootPath: '', columns: [] };
  });

  const selectPresetApi = (api) => {
    setConfig({ ...config, url: api.url, title: api.name });
    setShowPresets(false);
    setApiData(null);
    setApiMeta(null);
    setError(null);
  };

  const fetchApi = async () => {
    if (!config.url) return setError('Please enter an API URL');
    setLoading(true);
    setError(null);
    setApiData(null);
    setApiMeta(null);

    const start = performance.now();
    try {
      // Use internal proxy to bypass CORS
      const res = await axios({
        method: 'POST',
        url: '/api/proxy',
        data: {
          url: config.url,
          method: config.method,
        },
        timeout: 15000,
      });
      const elapsed = Math.round(performance.now() - start);

      setApiData(res.data);
      setApiMeta({
        status: res.status,
        statusText: res.statusText,
        time: elapsed,
        contentType: res.headers['content-type'] || 'application/json',
        dataType: Array.isArray(res.data) ? 'Array' : typeof res.data === 'object' ? 'Object' : typeof res.data,
        size: JSON.stringify(res.data).length,
      });
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      console.error('API Error:', err);
      setError(err.response?.data?.error || err.message || 'Request failed');
      setApiMeta({
        status: err.response?.status || 0,
        statusText: err.response?.statusText || 'Network Error',
        time: elapsed,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldSelect = (path, value) => {
    setSelectedField({ path, value });
  };

  const getRelativePath = (root, full) => {
    if (!root || !full.startsWith(root)) return full;
    let relative = full.substring(root.length);
    // Remove leading dot or bracket notation for the index (e.g. .0 or [0])
    relative = relative.replace(/^[\.\[]\d+[\]\.]?/, '');
    if (relative.startsWith('.')) relative = relative.substring(1);
    return relative;
  };

  const addCardMapping = () => {
    if (!selectedField) return;
    const label = prompt('Enter label for this field:', selectedField.path.split('.').pop());
    if (label) {
      setCardMappings([...cardMappings, { label, path: selectedField.path }]);
      setSelectedField(null);
    }
  };

  const setChartField = (type) => {
    if (!selectedField) return;
    let path = selectedField.path;
    
    // If setting xKey or yKey and rootPath is already set, try to make it relative
    if (type !== 'rootPath' && chartMapping.rootPath) {
       path = getRelativePath(chartMapping.rootPath, path);
    }

    setChartMapping({ ...chartMapping, [type]: path });
    setSelectedField(null);
  };

  const setTableRoot = () => {
    if (!selectedField) return;
    setTableMapping({ ...tableMapping, rootPath: selectedField.path });
    setSelectedField(null);
  };

  const addTableColumn = () => {
    if (!selectedField) return;
    const label = prompt('Enter column header:', selectedField.path.split('.').pop());
    if (label) {
      let path = selectedField.path;
      if (tableMapping.rootPath) {
        path = getRelativePath(tableMapping.rootPath, path);
      }
      setTableMapping({
        ...tableMapping,
        columns: [...tableMapping.columns, { label, path }],
      });
      setSelectedField(null);
    }
  };

  const handleSave = () => {
    if (!config.title.trim()) return alert('Please enter a widget title');
    if (!apiData) return alert('Please fetch API data first');

    let finalMapping = {};
    if (config.type === 'card') {
      finalMapping = cardMappings.reduce((acc, curr) => ({ ...acc, [curr.label]: curr.path }), {});
    } else if (config.type === 'chart') {
      finalMapping = chartMapping;
    } else if (config.type === 'table') {
      finalMapping = tableMapping;
    }

    const newWidgetConfig = {
      type: config.type,
      title: config.title,
      config: {
        url: config.url,
        method: config.method,
        interval: config.interval,
        type: 'rest',
        mapping: finalMapping,
      },
    };

    if (initialWidget) {
        updateWidget(initialWidget.id, newWidgetConfig);
    } else {
        addWidget({
            id: Date.now().toString(),
            ...newWidgetConfig
        });
    }

    onClose();
  };

  // Glass styles
  const glassCard = isDarkMode
    ? 'bg-gray-900/70 border-white/10'
    : 'bg-white/70 border-gray-200/60';

  const glassInput = isDarkMode
    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400'
    : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500';

  const labelClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const headingClass = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          'relative w-[900px] max-h-[90vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden',
          'backdrop-blur-2xl backdrop-saturate-150',
          glassCard
        )}
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(17,24,39,0.85) 0%, rgba(31,41,55,0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(249,250,251,0.95) 100%)',
        }}
      >
        {/* Header */}
        <div
          className={cn(
            'px-6 py-5 border-b flex justify-between items-center',
            isDarkMode ? 'border-white/10' : 'border-gray-200/60'
          )}
        >
          <div>
            <h2 className={cn('text-2xl font-bold tracking-tight', headingClass)}>
              {initialWidget ? 'Edit Widget' : 'Create Widget'}
            </h2>
            <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
              Connect any REST API and visualize your data
            </p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-xl transition-all active:scale-95',
              isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Widget Type - Pill Selection */}
          <div>
            <label className={cn('block text-sm font-semibold mb-3', labelClass)}>
              Widget Type
            </label>
            <div className="flex gap-3">
              {WIDGET_TYPES.map((wt) => {
                const Icon = wt.icon;
                const isActive = config.type === wt.id;
                return (
                  <button
                    key={wt.id}
                    onClick={() => setConfig({ ...config, type: wt.id })}
                    className={cn(
                      'flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all cursor-pointer',
                      isActive
                        ? isDarkMode
                          ? 'border-indigo-500 bg-indigo-500/20 text-white'
                          : 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : isDarkMode
                        ? 'border-gray-700 bg-gray-800/40 text-gray-400 hover:border-gray-600'
                        : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    <Icon size={22} className={isActive ? 'text-indigo-500' : ''} />
                    <div className="text-left">
                      <div className="font-semibold text-sm">{wt.label}</div>
                      <div className={cn('text-xs', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                        {wt.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Contextual helper text */}
            <p className={cn('mt-3 text-sm italic', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
              {config.type === 'card' && 'Cards: best for single values (price, change). Test an API and add the field you want to show.'}
              {config.type === 'chart' && 'Charts: use historical/time-series endpoints. Set Data Array Path, then pick X (time) and Y (value).'}
              {config.type === 'table' && 'Tables: select the array node as Data Array Path, then add columns from a sample item to build the table.'}
            </p>
          </div>

          {/* Title & Refresh Interval */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={cn('block text-sm font-semibold mb-2', labelClass)}>
                Widget Title
              </label>
              <input
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition',
                  glassInput
                )}
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                placeholder="e.g. Bitcoin Price, Stock Quote..."
              />
            </div>
            <div>
              <label className={cn('block text-sm font-semibold mb-2', labelClass)}>
                <RefreshCw size={14} className="inline mr-1" />
                Auto Refresh
              </label>
              <div className="flex gap-2 flex-wrap">
                {REFRESH_INTERVALS.map((ri) => (
                  <button
                    key={ri.value}
                    onClick={() => setConfig({ ...config, interval: ri.value })}
                    className={cn(
                      'px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer',
                      config.interval === ri.value
                        ? 'bg-indigo-600 text-white shadow-md'
                        : isDarkMode
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {ri.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div
            className={cn(
              'p-5 rounded-2xl border',
              isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'
            )}
          >
            {/* Preset API Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className={cn('text-sm font-semibold', labelClass)}>
                  <Sparkles size={14} className="inline mr-1 text-purple-500" />
                  Quick Select API
                </label>
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    isDarkMode
                      ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  )}
                >
                  Browse Presets <ChevronDown size={14} className={cn('transition-transform', showPresets && 'rotate-180')} />
                </button>
              </div>
              
              {showPresets && (
                <div
                  className={cn(
                    'rounded-xl border p-3 max-h-[320px] overflow-auto',
                    isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'
                  )}
                >
                  {PRESET_APIS.map((category) => (
                    <div key={category.category} className="mb-3 last:mb-0">
                      <div className={cn('text-xs font-bold mb-2 uppercase tracking-wide', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                        {category.category}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {category.apis.map((api) => (
                          <button
                            key={api.name}
                            onClick={() => selectPresetApi(api)}
                            className={cn(
                              'text-left p-2 rounded-lg text-xs transition-all hover:scale-[1.02]',
                              isDarkMode
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                            )}
                          >
                            <div className="font-semibold">{api.name}</div>
                            <div className={cn('text-[10px] mt-0.5 truncate', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                              {api.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className={cn('block text-sm font-semibold mb-3', labelClass)}>
              <Zap size={14} className="inline mr-1 text-amber-500" />
              API Endpoint
            </label>
            <div className="flex gap-2">
              <select
                className={cn(
                  'rounded-xl border px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30',
                  glassInput
                )}
                value={config.method}
                onChange={(e) => setConfig({ ...config, method: e.target.value })}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <input
                className={cn(
                  'flex-1 rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition',
                  glassInput
                )}
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://api.example.com/data or select from presets"
              />
              <button
                onClick={fetchApi}
                disabled={loading}
                className={cn(
                  'px-5 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50',
                  'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25'
                )}
              >
                {loading ? 'Testing...' : 'Test API'}
              </button>
            </div>
            <div className={cn('text-xs mt-2 space-y-1', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
              <p>Try: https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd</p>
              <p className="flex flex-wrap gap-2">
                <span className="font-medium">Get API Keys:</span>
                <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener" className="text-indigo-400 hover:underline">Alpha Vantage</a>
                <span>•</span>
                <a href="https://finnhub.io/register" target="_blank" rel="noopener" className="text-indigo-400 hover:underline">Finnhub</a>
                <span>•</span>
                <a href="https://www.coingecko.com/api/documentation" target="_blank" rel="noopener" className="text-indigo-400 hover:underline">CoinGecko (Free)</a>
              </p>
            </div>

            {/* API Response Meta */}
            {apiMeta && (
              <div
                className={cn(
                  'mt-4 p-4 rounded-xl flex items-center gap-6 text-sm',
                  apiMeta.status >= 200 && apiMeta.status < 300
                    ? isDarkMode
                      ? 'bg-green-900/30 border border-green-700/50'
                      : 'bg-green-50 border border-green-200'
                    : isDarkMode
                    ? 'bg-red-900/30 border border-red-700/50'
                    : 'bg-red-50 border border-red-200'
                )}
              >
                {apiMeta.status >= 200 && apiMeta.status < 300 ? (
                  <CheckCircle2 className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Status: </span>
                    <span className="font-semibold">
                      {apiMeta.status} {apiMeta.statusText}
                    </span>
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Time: </span>
                    <span className="font-semibold">{apiMeta.time}ms</span>
                  </div>
                  {apiMeta.dataType && (
                    <div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Type: </span>
                      <span className="font-semibold">{apiMeta.dataType}</span>
                    </div>
                  )}
                  {apiMeta.size && (
                    <div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Size: </span>
                      <span className="font-semibold">{(apiMeta.size / 1024).toFixed(1)}KB</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div
                className={cn(
                  'mt-4 p-3 rounded-xl text-sm',
                  isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'
                )}
              >
                {error}
              </div>
            )}
          </div>

          {/* Data Mapping */}
          {apiData && (
            <div className="grid grid-cols-2 gap-6">
              {/* JSON Explorer */}
              <div>
                <h3 className={cn('font-semibold mb-2', headingClass)}>Response Explorer</h3>
                <p className={cn('text-xs mb-3', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                  Click any field to select it for mapping
                </p>
                <div
                  className={cn(
                    'rounded-xl border p-3 max-h-[250px] overflow-auto',
                    isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                  )}
                >
                  <JsonExplorer data={apiData} onSelect={handleFieldSelect} />
                </div>
                {selectedField && (
                  <div
                    className={cn(
                      'mt-3 p-3 rounded-xl text-sm flex items-center gap-2',
                      isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700'
                    )}
                  >
                    <CheckCircle2 size={16} />
                    Selected: <code className="font-mono font-semibold">{selectedField.path}</code>
                  </div>
                )}
              </div>

              {/* Widget Configuration */}
              <div>
                <h3 className={cn('font-semibold mb-2', headingClass)}>Field Mapping</h3>

                {/* Card Mapping */}
                {config.type === 'card' && (
                  <div className="space-y-3">
                    <button
                      onClick={addCardMapping}
                      disabled={!selectedField}
                      className={cn(
                        'w-full py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40',
                        isDarkMode
                          ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      )}
                    >
                      + Add Field to Card
                    </button>
                    <div className="space-y-2 max-h-[200px] overflow-auto">
                      {cardMappings.map((m, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-xl text-sm',
                            isDarkMode ? 'bg-gray-800/60' : 'bg-gray-100'
                          )}
                        >
                          <div>
                            <span className="font-semibold">{m.label}</span>
                            <span className={cn('ml-2 text-xs', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                              {m.path}
                            </span>
                          </div>
                          <button
                            onClick={() => setCardMappings(cardMappings.filter((_, idx) => idx !== i))}
                            className="text-red-500 hover:text-red-600 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {cardMappings.length === 0 && (
                        <p className={cn('text-sm italic', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                          No fields mapped yet
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Chart Mapping */}
                {config.type === 'chart' && (
                  <div className="space-y-3">
                    {['rootPath', 'xKey', 'yKey'].map((field) => (
                      <div key={field}>
                        <label className={cn('block text-xs font-medium mb-1', labelClass)}>
                          {field === 'rootPath' ? 'Data Array Path' : field === 'xKey' ? 'X-Axis Key' : 'Y-Axis Key'}
                        </label>
                        <div className="flex gap-2">
                          <input
                            className={cn('flex-1 rounded-lg border px-3 py-2 text-sm', glassInput)}
                            value={chartMapping[field]}
                            readOnly
                            placeholder="Select from explorer"
                          />
                          <button
                            onClick={() => setChartField(field)}
                            disabled={!selectedField}
                            className={cn(
                              'px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40',
                              isDarkMode ? 'bg-indigo-600/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
                            )}
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Table Mapping */}
                {config.type === 'table' && (
                  <div className="space-y-3">
                    <div>
                      <label className={cn('block text-xs font-medium mb-1', labelClass)}>Data Array Path</label>
                      <div className="flex gap-2">
                        <input
                          className={cn('flex-1 rounded-lg border px-3 py-2 text-sm', glassInput)}
                          value={tableMapping.rootPath}
                          readOnly
                          placeholder="Select array from explorer"
                        />
                        <button
                          onClick={setTableRoot}
                          disabled={!selectedField}
                          className={cn(
                            'px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40',
                            isDarkMode ? 'bg-indigo-600/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
                          )}
                        >
                          Set
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={addTableColumn}
                      disabled={!selectedField}
                      className={cn(
                        'w-full py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40',
                        isDarkMode
                          ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      )}
                    >
                      + Add Column
                    </button>
                    <div className="space-y-2 max-h-[150px] overflow-auto">
                      {tableMapping.columns.map((col, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex items-center justify-between p-2 rounded-lg text-sm',
                            isDarkMode ? 'bg-gray-800/60' : 'bg-gray-100'
                          )}
                        >
                          <div>
                            <span className="font-semibold">{col.label}</span>
                            <span className={cn('ml-2 text-xs', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                              {col.path}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setTableMapping({
                                ...tableMapping,
                                columns: tableMapping.columns.filter((_, idx) => idx !== i),
                              })
                            }
                            className="text-red-500 hover:text-red-600 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={cn(
            'px-6 py-4 border-t flex justify-end gap-3',
            isDarkMode ? 'border-white/10 bg-gray-900/50' : 'border-gray-200/60 bg-white/50'
          )}
        >
          <button
            onClick={onClose}
            className={cn(
              'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95',
              isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiData || !config.title.trim()}
            className={cn(
              'px-6 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50',
              'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25'
            )}
          >
            Create Widget
          </button>
        </div>
      </div>
    </div>
  );
};

export default WidgetBuilder;
