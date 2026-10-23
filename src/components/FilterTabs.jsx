import React from 'react';
import { Sparkles, Eye, Palette, Landmark, Camera, Map } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Все', icon: Sparkles },
  { id: 'view', label: 'Смотровые', icon: Eye },
  { id: 'architecture', label: 'Архитектура', icon: Landmark },
  { id: 'art', label: 'Стрит-арт', icon: Palette },
  { id: 'photo', label: 'Фотоспоты', icon: Camera },
];

export default function FilterTabs({ 
  selectedCategory, 
  onSelectCategory,
  routes,
  selectedRouteId,
  onSelectRoute,
  showFoodFilter,
  setShowFoodFilter
}) {
  return (
    <div className="flex flex-col gap-2">
      {/* Категории */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id && !selectedRouteId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-[#3B6E75] text-white border-[#3B6E75]' 
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700/60 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {selectedRouteId && (
           <button
             onClick={() => onSelectRoute(null)}
             className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700/60 hover:text-white"
           >
             Сбросить маршрут
           </button>
        )}
        
        {routes.map((route) => {
          const isActive = selectedRouteId === route.id;
          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-[#3B6E75] text-white border-[#3B6E75]' 
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700/60 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{route.title}</span>
            </button>
          );
        })}

        <button
          onClick={() => setShowFoodFilter(!showFoodFilter)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
            showFoodFilter
              ? 'bg-[#3B6E75] text-white border-[#3B6E75]' 
              : 'bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700/60 hover:text-white'
          }`}
        >
          <span>По районам</span>
        </button>
      </div>
    </div>
  );
}