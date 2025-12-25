import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/store/dashboardStore';
import { ChevronDown, Sparkles } from 'lucide-react';
import { PRESET_APIS } from './constants';

const PresetSelector = ({ selectedType, onSelect }) => {
  const isDarkMode = useDashboardStore((state) => state.isDarkMode);
  const [showPresets, setShowPresets] = useState(false);
  const labelClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  const handleSelect = (api) => {
    onSelect(api);
    setShowPresets(false);
  };

  return (
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
          {PRESET_APIS.map((category) => {
            const filteredApis = category.apis.filter(api => !api.types || api.types.includes(selectedType));
            if (filteredApis.length === 0) return null;
            return (
              <div key={category.category} className="mb-3 last:mb-0">
                <div className={cn('text-xs font-bold mb-2 uppercase tracking-wide', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                  {category.category}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {filteredApis.map((api) => (
                    <button
                      key={api.name}
                      onClick={() => handleSelect(api)}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PresetSelector;
