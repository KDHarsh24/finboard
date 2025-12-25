import React from 'react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/store/dashboardStore';
import { Zap, CheckCircle2, XCircle } from 'lucide-react';
import PresetSelector from './PresetSelector';

const ApiConfigSection = ({ 
  config, 
  setConfig, 
  onFetch, 
  loading, 
  error, 
  apiMeta,
  setApiData,
  setApiMeta,
  setError
}) => {
  const isDarkMode = useDashboardStore((state) => state.isDarkMode);
  const labelClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const glassInput = isDarkMode
    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400'
    : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500';

  const handlePresetSelect = (api) => {
    setConfig({ ...config, url: api.url, title: api.name });
    setApiData(null);
    setApiMeta(null);
    setError(null);
  };

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border',
        isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'
      )}
    >
      <PresetSelector selectedType={config.type} onSelect={handlePresetSelect} />

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
          onClick={onFetch}
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
  );
};

export default ApiConfigSection;
