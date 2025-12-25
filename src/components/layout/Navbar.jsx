"use client";

import React from "react";
import { Plus, Moon, Sun, Download, Upload, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar({ isDarkMode, toggleTheme, onExport, onImport, onAdd }) {
  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isDarkMode ? "border-white/8" : "border-black/8"
      )}
      style={{
        backgroundColor: isDarkMode ? 'rgba(9,10,11,0.01)' : 'rgba(255,255,255,0.01)',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        WebkitBackdropFilter: 'blur(60px) saturate(160%)',
        backdropFilter: 'blur(60px) saturate(160%)'
      }}
    >
      <div className="px-4 sm:px-6 lg:px-24">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/groww-icon.svg" alt="Groww Logo" className="h-8 w-8" />
            <span className={cn(
              "text-xl font-bold tracking-tight",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              FinBoard
            </span>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className={cn(
                "relative h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer",
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              )}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              <div
                className={cn(
                  "absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center",
                  isDarkMode ? "translate-x-6" : "translate-x-0"
                )}
              >
                {isDarkMode ? (
                  <Moon size={14} className="text-indigo-500" />
                ) : (
                  <Sun size={14} className="text-amber-500" />
                )}
              </div>
            </button>

            <div className={cn(
              "h-6 w-px mx-1 hidden sm:block",
              isDarkMode ? "bg-gray-300" : "bg-gray-800"
            )} />

            <button onClick={onExport}
              className={cn(
                "hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer",
                  isDarkMode 
                    ? "text-gray-200 hover:bg-gray-800" 
                    : "text-gray-900 hover:bg-indigo-50"
              )}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <label className={cn(
              "hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500/20",
                isDarkMode 
                  ? "text-gray-200 hover:bg-gray-800" 
                  : "text-gray-900 hover:bg-indigo-50"
            )}>
              <input type="file" className="hidden" accept=".json" onChange={onImport} />
              <Upload size={16} />
              <span>Import</span>
            </label>

            <button onClick={onExport} className={cn("sm:hidden p-2", isDarkMode ? "text-gray-200" : "text-gray-900")}>
                <Download size={20} />
            </button>
            <label className={cn("sm:hidden p-2 cursor-pointer", isDarkMode ? "text-gray-200" : "text-gray-900")}>
                <input type="file" className="hidden" accept=".json" onChange={onImport} />
                <Upload size={20} />
            </label>

            {/* Add Widget Button */}
            <button
              onClick={onAdd}
              className={cn(
                "ml-2 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer",
                isDarkMode
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              )}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Widget</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
