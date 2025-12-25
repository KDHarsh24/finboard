import React from 'react';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import { mapData } from '@/lib/utils';
import WidgetWrapper from './WidgetWrapper';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/store/dashboardStore';

const TableWidget = ({ widget, onEdit }) => {
  const { data, loading, error } = useDataFetcher(widget.config);
  const isDarkMode = useDashboardStore((state) => state.isDarkMode);

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

  const { rootPath, columns } = widget.config.mapping || {};
  
  // Extract the array data
  let tableData = [];
  if (rootPath) {
    const extracted = mapData(data, rootPath);
    if (Array.isArray(extracted)) {
      tableData = extracted;
    }
  } else if (Array.isArray(data)) {
    tableData = data;
  }

  return (
    <WidgetWrapper widget={widget} onEdit={onEdit}>
      <div className="overflow-auto h-full w-full">
        <table className="w-full text-sm text-left">
          <thead className={cn("text-xs uppercase sticky top-0", isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-700")}>
            <tr>
              {columns?.map((col, idx) => (
                <th key={idx} className="px-4 py-3 font-medium whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tableData.length > 0 ? (
              tableData.map((row, rowIdx) => (
                <tr key={rowIdx} className={cn("hover:bg-gray-50 dark:hover:bg-gray-800/50")}>
                  {columns?.map((col, colIdx) => {
                    // If path is empty, it means we want the row itself (e.g. array of strings)
                    // Otherwise, get the property from the row
                    let cellValue = row;
                    if (col.path) {
                        // Handle case where path might still be absolute (legacy support)
                        // But primarily trust it's relative
                        cellValue = mapData(row, col.path);
                        
                        // Fallback: if undefined, and path looks absolute, try to strip root
                        if (cellValue === undefined && rootPath && col.path.includes(rootPath)) {
                             const relative = col.path.split(rootPath)[1]?.replace(/^[\.\[]\d+[\]\.]?/, '').replace(/^\./, '');
                             if (relative) cellValue = mapData(row, relative);
                        }
                    }

                    return (
                      <td key={colIdx} className="px-4 py-3 whitespace-nowrap">
                        {typeof cellValue === 'object' && cellValue !== null ? (
                            <span className="text-xs text-gray-500 font-mono">{JSON.stringify(cellValue).slice(0, 50)}...</span>
                        ) : (
                            String(cellValue ?? '-')
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns?.length || 1} className="px-4 py-8 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </WidgetWrapper>
  );
};

export default TableWidget;
