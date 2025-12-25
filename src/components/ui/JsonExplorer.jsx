import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const JsonNode = ({ name, value, path, onSelect, level = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const isObject = typeof value === 'object' && value !== null;
  const currentPath = path ? `${path}.${name}` : name;

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect(currentPath, value);
  };

  if (!isObject) {
    return (
      <div 
        className="pl-4 py-1 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-sm"
        onClick={handleSelect}
      >
        <span className="text-black font-medium">{name}:</span>
        <span className="text-green-600 truncate">{String(value)}</span>
      </div>
    );
  }

  return (
    <div className="pl-2">
      <div 
        className="flex items-center gap-1 py-1 cursor-pointer hover:bg-gray-100"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className="font-bold text-sm text-purple-700">{name}</span>
        <span className="text-xs text-gray-600">({Array.isArray(value) ? `Array[${value.length}]` : 'Object'})</span>
        <button 
          className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded hover:bg-blue-200 cursor-pointer transition-colors duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(currentPath, value);
          }}
        >
          Select
        </button>
      </div>
      {expanded && (
        <div className="border-l border-gray-200 ml-2">
          {Object.entries(value).map(([key, val]) => (
            <JsonNode 
              key={key} 
              name={key} 
              value={val} 
              path={currentPath} 
              onSelect={onSelect} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const JsonExplorer = ({ data, onSelect }) => {
  if (!data) return <div className="text-gray-600 text-sm">No data to explore</div>;

  return (
    <div className="border rounded bg-white p-2 max-h-[300px] overflow-auto">
      {Object.entries(data).map(([key, val]) => (
        <JsonNode key={key} name={key} value={val} path="" onSelect={onSelect} />
      ))}
    </div>
  );
};

export default JsonExplorer;
