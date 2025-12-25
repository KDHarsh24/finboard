import React from 'react';
import { X, Settings } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { cn } from '@/lib/utils';

const WidgetWrapper = ({ widget, children, className, onEdit }) => {
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const isDarkMode = useDashboardStore((state) => state.isDarkMode);

  return (
    <div className={cn(
      "h-full w-full flex flex-col rounded-lg shadow-md overflow-hidden border",
      isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900",
      className
    )}>
      <div className={cn(
        "flex items-center justify-between px-4 py-2 border-b",
        isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-100 bg-gray-50"
      )}>
        <h3 className="font-semibold text-sm truncate">{widget.title || 'Untitled Widget'}</h3>
        <div className="flex items-center gap-2">
          {/* Settings button */}
          <button 
            onClick={() => onEdit && onEdit(widget)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <Settings size={14} />
          </button>
          <button 
            onClick={() => removeWidget(widget.id)}
            className="p-1 hover:bg-red-100 text-red-500 rounded cursor-pointer transition-colors duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300"
            title="Remove widget"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto relative">
        {children}
      </div>
    </div>
  );
};

export default WidgetWrapper;
