'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useDashboardStore } from '@/store/dashboardStore';
import { X, RefreshCw } from 'lucide-react';
import { REFRESH_INTERVALS } from './widget-builder/constants';
import WidgetTypeSelector from './widget-builder/WidgetTypeSelector';
import ApiConfigSection from './widget-builder/ApiConfigSection';
import MappingSection from './widget-builder/MappingSection';

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
          <WidgetTypeSelector 
            selectedType={config.type} 
            onSelect={(type) => setConfig({ ...config, type })} 
          />

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
          <ApiConfigSection
            config={config}
            setConfig={setConfig}
            onFetch={fetchApi}
            loading={loading}
            error={error}
            apiMeta={apiMeta}
            setApiData={setApiData}
            setApiMeta={setApiMeta}
            setError={setError}
          />

          {/* Data Mapping */}
          {apiData && (
            <MappingSection
              config={config}
              apiData={apiData}
              selectedField={selectedField}
              onFieldSelect={setSelectedField}
              cardMappings={cardMappings}
              setCardMappings={setCardMappings}
              chartMapping={chartMapping}
              setChartMapping={setChartMapping}
              tableMapping={tableMapping}
              setTableMapping={setTableMapping}
            />
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
