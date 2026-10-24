import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Eye,
  Palette,
  Landmark,
  Camera,
  Compass,
  MapPin,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';

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
  onResetFilters,
  isFiltered,
}) {
  const [routeOpen, setRouteOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setRouteOpen(false);
        setDistrictOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRoute = routes.find((r) => r.id === selectedRouteId);

  return (
    <div ref={containerRef} className="flex flex-col gap-2.5">
      {/* Категории мест - аккуратные кнопки с иконками */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id && !selectedRouteId;
          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setRouteOpen(false);
                setDistrictOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-[13px] font-medium rounded-lg transition-colors border active:scale-95 ${
                isActive
                  ? 'bg-[#3B6E75] text-white border-[#3B6E75] shadow-sm'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:bg-zinc-750 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Маршруты и Районы - стильные кастомные дропдауны, оптимизированные для пальца */}
      <div className="grid grid-cols-2 gap-2 relative">
        {/* Дропдаун маршрутов */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setRouteOpen(!routeOpen);
              setDistrictOpen(false);
            }}
            className={`w-full flex items-center justify-between gap-1.5 px-3 py-2 text-xs sm:text-[13px] rounded-lg border transition-colors active:scale-98 ${
              selectedRouteId
                ? 'bg-[#3B6E75]/20 border-[#3B6E75] text-white font-medium'
                : 'bg-zinc-800 border-zinc-700/80 text-zinc-200 hover:border-zinc-600'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <Compass className="w-3.5 h-3.5 text-[#8ec8ce] shrink-0" />
              <span className="truncate">
                {currentRoute ? currentRoute.title : 'Маршруты'}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                routeOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {routeOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-[220px] sm:w-64 max-w-[calc(100vw-36px)] z-50 bg-zinc-900 border border-zinc-700/90 rounded-xl shadow-2xl p-1.5 backdrop-blur-md max-h-64 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  onSelectRoute(null);
                  setRouteOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-[13px] rounded-lg transition-colors text-left ${
                  !selectedRouteId
                    ? 'bg-[#3B6E75]/25 text-white font-medium border border-[#3B6E75]/40'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span>Все маршруты</span>
                {!selectedRouteId && <Check className="w-3.5 h-3.5 text-[#8ec8ce]" />}
              </button>

              <div className="my-1 border-t border-zinc-800" />

              {routes.map((route) => {
                const isSelected = selectedRouteId === route.id;
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => {
                      onSelectRoute(route.id);
                      setRouteOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-[13px] rounded-lg transition-colors text-left ${
                      isSelected
                        ? 'bg-[#3B6E75]/25 text-white font-medium border border-[#3B6E75]/40'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{route.title}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#8ec8ce] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Дропдаун районов */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setDistrictOpen(!districtOpen);
              setRouteOpen(false);
            }}
            className={`w-full flex items-center justify-between gap-1.5 px-3 py-2 text-xs sm:text-[13px] rounded-lg border transition-colors active:scale-98 ${
              selectedDistrict !== 'all'
                ? 'bg-[#3B6E75]/20 border-[#3B6E75] text-white font-medium'
                : 'bg-zinc-800 border-zinc-700/80 text-zinc-200 hover:border-zinc-600'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#8ec8ce] shrink-0" />
              <span className="truncate">
                {selectedDistrict === 'all' ? 'Все районы' : selectedDistrict}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                districtOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {districtOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-[200px] sm:w-56 max-w-[calc(100vw-36px)] z-50 bg-zinc-900 border border-zinc-700/90 rounded-xl shadow-2xl p-1.5 backdrop-blur-md max-h-64 overflow-y-auto">
              {DISTRICTS.map((d) => {
                const val = d === 'Все районы' ? 'all' : d;
                const isSelected = selectedDistrict === val;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      onSelectDistrict(val);
                      setDistrictOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-[13px] rounded-lg transition-colors text-left ${
                      isSelected
                        ? 'bg-[#3B6E75]/25 text-white font-medium border border-[#3B6E75]/40'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>{d}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#8ec8ce] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Кнопка сброса всех фильтров */}
      {isFiltered && (
        <div className="flex justify-end pt-0.5">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-800/80 hover:bg-zinc-750 border border-zinc-700/80 rounded-lg transition-colors active:scale-95"
            title="Сбросить все примененные фильтры"
          >
            <X className="w-3.5 h-3.5" />
            <span>Сбросить фильтры</span>
          </button>
        </div>
      )}
    </div>
  );
}
