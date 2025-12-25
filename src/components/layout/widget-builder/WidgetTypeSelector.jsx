import React from 'react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/store/dashboardStore';
import { WIDGET_TYPES } from './constants';

const WidgetTypeSelector = ({ selectedType, onSelect }) => {
  const isDarkMode = useDashboardStore((state) => state.isDarkMode);
  const labelClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div>
      <label className={cn('block text-sm font-semibold mb-3', labelClass)}>
        Widget Type
      </label>
      <div className="flex gap-3">
        {WIDGET_TYPES.map((wt) => {
          const Icon = wt.icon;
          const isActive = selectedType === wt.id;
          return (
            <button
              key={wt.id}
              onClick={() => onSelect(wt.id)}
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
        {selectedType === 'card' && 'Cards: best for single values (price, change). Test an API and add the field you want to show.'}
        {selectedType === 'chart' && 'Charts: use historical/time-series endpoints. Set Data Array Path, then pick X (time) and Y (value).'}
        {selectedType === 'table' && 'Tables: select the array node as Data Array Path, then add columns from a sample item to build the table.'}
      </p>
    </div>
  );
};

export default WidgetTypeSelector;
