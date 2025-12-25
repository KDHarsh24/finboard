import React from 'react';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import { mapData } from '@/lib/utils';
import WidgetWrapper from './WidgetWrapper';

const CardWidget = ({ widget, onEdit }) => {
  const { data, loading, error } = useDataFetcher(widget.config);

  if (loading && !data) {
    return (
      <WidgetWrapper widget={widget} onEdit={onEdit}>
        <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>
      </WidgetWrapper>
    );
  }

  if (error) {
    return (
      <WidgetWrapper widget={widget} onEdit={onEdit}>
        <div className="flex items-center justify-center h-full text-red-500 text-sm text-center">
          {error}
        </div>
      </WidgetWrapper>
    );
  }

  const mappings = widget.config.mapping || {};

  return (
    <WidgetWrapper widget={widget} onEdit={onEdit}>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(mappings).map(([label, path]) => {
          const rawValue = mapData(data, path);
          let displayValue = rawValue;

          // Auto-format numbers
          if (!isNaN(parseFloat(rawValue)) && isFinite(rawValue)) {
             // Check if it looks like a price (heuristic)
             if (label.toLowerCase().includes('price') || label.toLowerCase().includes('volume')) {
                displayValue = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 6 }).format(rawValue);
             } else if (label.toLowerCase().includes('change') || label.toLowerCase().includes('percent')) {
                displayValue = `${parseFloat(rawValue).toFixed(2)}%`;
             }
          }

          return (
            <div key={label} className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase font-medium">{label}</span>
              <span className="text-2xl font-bold truncate" title={String(rawValue)}>
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    </WidgetWrapper>
  );
};

export default CardWidget;
