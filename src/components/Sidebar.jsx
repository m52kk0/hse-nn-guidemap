import React from 'react';
import { Search, MapPinOff, RotateCcw } from 'lucide-react';
import FilterTabs from './FilterTabs.jsx';
import PlaceCard from './PlaceCard.jsx';

export default function Sidebar({
  places,
  selectedPlace,
  onSelectPlace,
  onOpenDetails,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  routes,
  selectedRouteId,
  onSelectRoute,
  selectedDistrict,
  onSelectDistrict,
  onResetFilters,
  isFiltered,
  visitedIds,
  onToggleVisited,
}) {
  return (
    <aside className="w-full md:w-[460px] lg:w-[500px] xl:w-[530px] h-full flex flex-col bg-zinc-900/95 border-r border-zinc-800 shrink-0">
      <div className="p-3.5 sm:p-4 bg-zinc-900 border-b border-zinc-800 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Поиск по местам, описанию, районам..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700/80 rounded-xl outline-none focus:border-[#3B6E75] focus:ring-1 focus:ring-[#3B6E75] transition-colors"
          />
        </div>

        <FilterTabs
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          routes={routes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={onSelectRoute}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={onSelectDistrict}
          onResetFilters={onResetFilters}
          isFiltered={isFiltered}
        />
      </div>

      {/* Список карточек с отступом снизу на мобилках pb-28, чтобы плавающая кнопка не перекрывала последнюю карточку */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 pb-28 md:pb-4 scroll-smooth">
        {places.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
            <MapPinOff className="w-9 h-9 mb-2 stroke-[1.5]" />
            <p className="text-base font-medium text-zinc-300">Ничего не найдено</p>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">Попробуйте изменить категорию или фильтры</p>
            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="mt-3.5 flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm text-[#8ec8ce] hover:text-white bg-[#3B6E75]/20 hover:bg-[#3B6E75]/40 border border-[#3B6E75]/40 rounded-xl transition-colors font-medium active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Сбросить все фильтры</span>
              </button>
            )}
          </div>
        ) : (
          places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isSelected={selectedPlace?.id === place.id}
              onSelect={() => onSelectPlace(place)}
              onOpenDetails={() => onOpenDetails(place)}
              isVisited={visitedIds.includes(place.id)}
              onToggleVisited={() => onToggleVisited(place.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
