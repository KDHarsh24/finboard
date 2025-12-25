'use client';

import React, { useState } from 'react';
import Dashboard from '@/components/layout/Dashboard';
import WidgetBuilder from '@/components/layout/WidgetBuilder';
import Navbar from '@/components/layout/Navbar';
import { Plus, Moon, Sun, Download, Upload } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { cn } from '@/lib/utils';

export default function Home() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWidget, setEditingWidget] = useState(null);
  const { isDarkMode, toggleTheme, widgets, updateLayout } = useDashboardStore();

  const handleExport = () => {
    const data = JSON.stringify({ widgets, layout: useDashboardStore.getState().layout }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finboard-config.json';
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.widgets && data.layout) {
          useDashboardStore.setState({ widgets: data.widgets, layout: data.layout });
        }
      } catch (err) {
        alert('Invalid configuration file');
      }
    };
    reader.readAsText(file);
  };

  const handleEditWidget = (widget) => {
    setEditingWidget(widget);
    setShowBuilder(true);
  };

  const handleCloseBuilder = () => {
    setShowBuilder(false);
    setEditingWidget(null);
  };

  return (
    <div className={cn("min-h-screen flex flex-col", isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900")}>
      {/* Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onExport={handleExport}
        onImport={handleImport}
        onAdd={() => setShowBuilder(true)}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto px-24">
        {widgets.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
            <p className="text-lg mb-4 font-medium">Your dashboard is empty</p>
            <button 
              onClick={() => setShowBuilder(true)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-gray-100 shadow-lg"
            >
              Create First Widget
            </button>
          </div>
        ) : (
          <Dashboard onEdit={handleEditWidget} />
        )}
      </main>

      {showBuilder && <WidgetBuilder onClose={handleCloseBuilder} initialWidget={editingWidget} />}
    </div>
  );
}
