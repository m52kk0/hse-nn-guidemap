import React from 'react';
import { Sparkles, Eye, Palette, Landmark, Camera, Map, Utensils } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Все места', icon: Sparkles },
  { id: 'view', label: 'Смотровые', icon: Eye },
  { id: 'art', label: 'Стрит-арт', icon: Palette },
  { id: 'architecture', label: 'Архитектура', icon: Landmark },
  { id: 'photo', label: 'Фотолокации', icon: Camera },
];

export default function FilterTabs({ 
  selectedCategory, 
  onSelectCategory,
  isRoutesTab,
  setIsRoutesTab,
  showFoodFilter,
  setShowFoodFilter
}) {
  return (
    <div className="flex flex-col gap-3 pb-2 pt-1">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id && !isRoutesTab;
          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setIsRoutesTab(false); 
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsRoutesTab(!isRoutesTab)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 border ${
            isRoutesTab
              ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/25'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Готовые маршруты</span>
        </button>

        <button
          onClick={() => setShowFoodFilter(!showFoodFilter)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 border ${
            showFoodFilter
              ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-500/25'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Где поесть рядом</span>
        </button>
      </div>
    </div>
  );
}