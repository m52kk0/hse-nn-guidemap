import React from 'react';
import { Sparkles, Eye, Palette, Landmark, Camera, Map, X, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Все места', icon: Sparkles },
  { id: 'view', label: 'Смотровые', icon: Eye },
  { id: 'architecture', label: 'Архитектура', icon: Landmark },
  { id: 'art', label: 'Стрит-арт', icon: Palette },
  { id: 'photo', label: 'Фотоспоты', icon: Camera },
];

const DISTRICTS = [
  'Все районы',
  'Нижегородский',
  'Канавинский',
  'Советский',
  'Сормовский',
  'Приокский',
  'Автозаводский',
  'Загородные',
];

export default function FilterTabs({
  selectedCategory,
  onSelectCategory,
  routes = [],
  selectedRouteId,
  onSelectRoute,
  selectedDistrict,
  onSelectDistrict,
  onlyUnvisited,
  onToggleOnlyUnvisited,
  onResetFilters,
  isFiltered,
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Категории мест */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id && !selectedRouteId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-[#3B6E75] text-white border-[#3B6E75] shadow-sm'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700/60 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Готовые маршруты */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 shrink-0 mr-1 flex items-center gap-1">
          <Map className="w-3 h-3" />
          Маршруты:
        </span>

        {routes.map((route) => {
          const isActive = selectedRouteId === route.id;
          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(isActive ? null : route.id)}
              title={route.description}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-[#3B6E75] text-white border-[#3B6E75] shadow-sm'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700/60 hover:text-white'
              }`}
            >
              <span>{route.title}</span>
            </button>
          );
        })}

        {selectedRouteId && (
          <button
            onClick={() => onSelectRoute(null)}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/80 shrink-0 transition-colors"
            title="Сбросить выбранный маршрут"
          >
            <X className="w-3.5 h-3.5" />
            <span>Сброс</span>
          </button>
        )}
      </div>

      {/* Районы и фильтр непосещённых */}
      <div className="flex items-center gap-2 pt-0.5">
        <div className="flex-1 relative">
          <select
            value={selectedDistrict}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="w-full text-xs bg-zinc-800 text-zinc-200 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#3B6E75] focus:ring-1 focus:ring-[#3B6E75] transition-colors cursor-pointer appearance-none pr-7"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d === 'Все районы' ? 'all' : d} className="bg-zinc-900 text-zinc-200">
                {d}
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[10px]">
            ▼
          </div>
        </div>

        <button
          onClick={onToggleOnlyUnvisited}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
            onlyUnvisited
              ? 'bg-[#3B6E75] text-white border-[#3B6E75]'
              : 'bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700/60 hover:text-white'
          }`}
          title="Показывать только места, которые вы еще не посетили"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Новые</span>
        </button>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700/60 border border-zinc-700/80 rounded-lg transition-colors shrink-0"
            title="Сбросить все фильтры"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Сбросить</span>
          </button>
        )}
      </div>
    </div>
  );
}
