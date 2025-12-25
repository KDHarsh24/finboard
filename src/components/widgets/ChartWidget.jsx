import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import { mapData } from '@/lib/utils';
import WidgetWrapper from './WidgetWrapper';
import _ from 'lodash';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartWidget = ({ widget, onEdit }) => {
  const { data, loading, error } = useDataFetcher(widget.config);

  const chartData = useMemo(() => {
    if (!data) return null;

    const mapping = widget.config.mapping || {};
    // Expecting mapping.xPath and mapping.yPath
    // Or if it's an array of objects, mapping.rootPath, mapping.xKey, mapping.yKey
    
    let labels = [];
    let values = [];

    if (mapping.rootPath) {
      const root = _.get(data, mapping.rootPath);
      if (Array.isArray(root)) {
        labels = root.map((item, index) => {
            // If xKey is not provided, use index
            if (!mapping.xKey) return index;
            
            // Get value
            const val = _.get(item, mapping.xKey);
            
            // Auto-format timestamp (simple heuristic)
            if (typeof val === 'number' && val > 999999999) {
                const date = new Date(val);
                return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            }
            return val;
        });
        
        values = root.map(item => {
            // If yKey is not provided, try to use item itself if it's a number
            if (!mapping.yKey) return typeof item === 'number' ? item : 0;
            return _.get(item, mapping.yKey);
        });
      } else if (typeof root === 'object' && root !== null) {
        // Handle object keys as labels (e.g. Alpha Vantage)
        labels = Object.keys(root).reverse(); // Usually dates are descending
        values = Object.values(root).map(item => _.get(item, mapping.yKey)).reverse();
      }
    }

    return {
      labels,
      datasets: [
        {
          label: widget.title || 'Data',
          data: values,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.2,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    };
  }, [data, widget.config]);

  if (loading && !data) {
    return <WidgetWrapper widget={widget} onEdit={onEdit}><div className="flex justify-center items-center h-full">Loading Chart...</div></WidgetWrapper>;
  }

  if (error) {
    return <WidgetWrapper widget={widget} onEdit={onEdit}><div className="text-red-500">{error}</div></WidgetWrapper>;
  }

  if (!chartData || chartData.labels.length === 0) {
    return <WidgetWrapper widget={widget} onEdit={onEdit}><div className="text-gray-400">No data to display</div></WidgetWrapper>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <WidgetWrapper widget={widget} onEdit={onEdit}>
      <div className="h-full w-full min-h-[200px]">
        <Line options={options} data={chartData} />
      </div>
    </WidgetWrapper>
  );
};

export default ChartWidget;
