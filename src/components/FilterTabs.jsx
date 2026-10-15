import React from 'react';
import { Sparkles, Eye, Palette, Landmark, Camera } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Все места', icon: Sparkles },
  { id: 'view', label: 'Смотровые', icon: Eye },
  { id: 'art', label: 'Стрит-арт', icon: Palette },
  { id: 'architecture', label: 'Архитектура', icon: Landmark },
  { id: 'photo', label: 'Фотолокации', icon: Camera },
];

export default function FilterTabs({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
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
  );
}
