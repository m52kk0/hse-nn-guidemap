import React from 'react';
import { Sparkles, Eye, Palette, Landmark, Camera, X, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Все', icon: Sparkles },
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
      {/* Категории мест - аккуратно переносятся по строкам без горизонтального скролла */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id && !selectedRouteId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                isActive
                  ? 'bg-[#3B6E75] text-white border-[#3B6E75] shadow-sm'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700/60 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Маршруты и Районы - два компактных селектора в одну строку */}
      <div className="grid grid-cols-2 gap-2">
        {/* Готовые маршруты */}
        <div className="relative">
          <select
            value={selectedRouteId || ''}
            onChange={(e) => onSelectRoute(e.target.value ? e.target.value : null)}
            className={`w-full text-xs bg-zinc-800 border rounded-lg px-2.5 py-1.5 outline-none transition-colors cursor-pointer appearance-none pr-6 truncate ${
              selectedRouteId
                ? 'text-white border-[#3B6E75] bg-[#3B6E75]/20 font-medium'
                : 'text-zinc-300 border-zinc-700/80 hover:border-zinc-600'
            }`}
          >
            <option value="" className="bg-zinc-900 text-zinc-300">
              🗺 Маршруты: все
            </option>
            {routes.map((route) => (
              <option key={route.id} value={route.id} className="bg-zinc-900 text-zinc-200">
                {route.title}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Районы города */}
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className={`w-full text-xs bg-zinc-800 border rounded-lg px-2.5 py-1.5 outline-none transition-colors cursor-pointer appearance-none pr-6 truncate ${
              selectedDistrict !== 'all'
                ? 'text-white border-[#3B6E75] bg-[#3B6E75]/20 font-medium'
                : 'text-zinc-300 border-zinc-700/80 hover:border-zinc-600'
            }`}
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d === 'Все районы' ? 'all' : d} className="bg-zinc-900 text-zinc-200">
                {d === 'Все районы' ? '📍 Все районы' : d}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* Быстрые действия: кнопка «Только новые» и сброс */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <button
          type="button"
          onClick={onToggleOnlyUnvisited}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
            onlyUnvisited
              ? 'bg-[#3B6E75] text-white border-[#3B6E75] shadow-sm'
              : 'bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700/60 hover:text-white'
          }`}
          title="Скрыть уже посещённые места"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Только новые</span>
        </button>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700/60 border border-zinc-700/80 rounded-lg transition-colors"
            title="Сбросить все фильтры"
          >
            <X className="w-3.5 h-3.5" />
            <span>Сбросить всё</span>
          </button>
        )}
      </div>
    </div>
  );
}
