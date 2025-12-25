'use client';
import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore } from '@/store/dashboardStore';
import CardWidget from '@/components/widgets/CardWidget';
import ChartWidget from '@/components/widgets/ChartWidget';
import TableWidget from '@/components/widgets/TableWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = ({ onEdit }) => {
  const { widgets, layout, updateLayout } = useDashboardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onLayoutChange = (currentLayout) => {
    updateLayout(currentLayout);
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'card':
        return <CardWidget widget={widget} onEdit={onEdit} />;
      case 'chart':
        return <ChartWidget widget={widget} onEdit={onEdit} />;
      case 'table': 
        return <TableWidget widget={widget} onEdit={onEdit} />;
      default:
        return <div className="p-4">Unknown Widget Type</div>;
    }
  };

  if (!mounted) return null;

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 12, sm: 8, xs: 4, xxs: 2 }}
      rowHeight={100}
      onLayoutChange={onLayoutChange}
      draggableHandle=".border-b" // Drag by header
      compactType="vertical"
      preventCollision={false}
    >
      {widgets.map((widget) => (
        <div key={widget.id} className="bg-transparent">
          {renderWidget(widget)}
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default Dashboard;
