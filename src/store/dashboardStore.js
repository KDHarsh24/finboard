import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDashboardStore = create(
  persist(
    (set) => ({
      widgets: [],
      layout: [],
      isDarkMode: false,
      
      addWidget: (widget) => set((state) => {
        const width = 4;
        const height = 4;
        let x = 0;
        let y = 0;
        let found = false;

        // Find first available space
        // We scan rows (y) and fixed columns (x = 0, 4, 8)
        // This ensures a clean 3-column layout
        for (let checkY = 0; checkY < 1000; checkY++) {
          for (let checkX = 0; checkX <= 8; checkX += 4) {
            const collision = state.layout.some(item => {
              return (
                item.x < checkX + width &&
                item.x + item.w > checkX &&
                item.y < checkY + height &&
                item.y + item.h > checkY
              );
            });

            if (!collision) {
              x = checkX;
              y = checkY;
              found = true;
              break;
            }
          }
          if (found) break;
        }

        return {
          widgets: [...state.widgets, widget],
          layout: [...state.layout, { i: widget.id, x, y, w: width, h: height }]
        };
      }),
      
      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter((w) => w.id !== id),
        layout: state.layout.filter((l) => l.i !== id)
      })),
      
      updateWidget: (id, newConfig) => set((state) => ({
        widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...newConfig } : w))
      })),
      
      updateLayout: (newLayout) => set({ layout: newLayout }),
      
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'finboard-storage',
    }
  )
);
