import React from 'react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/store/dashboardStore';
import JsonExplorer from '@/components/ui/JsonExplorer';
import { CheckCircle2 } from 'lucide-react';

const MappingSection = ({
  config,
  apiData,
  selectedField,
  onFieldSelect,
  cardMappings,
  setCardMappings,
  chartMapping,
  setChartMapping,
  tableMapping,
  setTableMapping,
}) => {
  const isDarkMode = useDashboardStore((state) => state.isDarkMode);
  const labelClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const headingClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const glassInput = isDarkMode
    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400'
    : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500';

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
      onFieldSelect(null);
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
    onFieldSelect(null);
  };

  const setTableRoot = () => {
    if (!selectedField) return;
    setTableMapping({ ...tableMapping, rootPath: selectedField.path });
    onFieldSelect(null);
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
      onFieldSelect(null);
    }
  };

  return (
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
          <JsonExplorer data={apiData} onSelect={(path, value) => onFieldSelect({ path, value })} />
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
  );
};

export default MappingSection;
