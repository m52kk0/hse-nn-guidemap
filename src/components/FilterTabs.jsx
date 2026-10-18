import React from 'react';
import { Sparkles, Eye, Palette, Landmark, Camera } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Все', icon: Sparkles },
  { id: 'view', label: 'Смотровые', icon: Eye },
  { id: 'architecture', label: 'Архитектура', icon: Landmark },
  { id: 'art', label: 'Стрит-арт', icon: Palette },
  { id: 'photo', label: 'Фотоспоты', icon: Camera },
];

export default function FilterTabs({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;
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
  );
}
