import React from 'react';
import { Search, MapPinOff } from 'lucide-react';
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
  // ТВОИ НОВЫЕ ПРОПСЫ:
  isRoutesTab,
  setIsRoutesTab,
  showFoodFilter,
  setShowFoodFilter,
  // ПРОПСЫ ТИМЛИДА (для посещенных мест):
  visitedIds,
  onToggleVisited,
}) {
  return (
    <aside className="w-full md:w-[400px] lg:w-[440px] h-full flex flex-col bg-zinc-900/95 border-r border-zinc-800 shrink-0">
      <div className="p-3.5 bg-zinc-900 border-b border-zinc-800 space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Поиск по местам, районам..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700/80 rounded-lg outline-none focus:border-[#3B6E75] focus:ring-1 focus:ring-[#3B6E75] transition-colors"
          />
        </div>

        <FilterTabs
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          // ПЕРЕДАЕМ ТВОИ НОВЫЕ ПРОПСЫ:
          isRoutesTab={isRoutesTab}
          setIsRoutesTab={setIsRoutesTab}
          showFoodFilter={showFoodFilter}
          setShowFoodFilter={setShowFoodFilter}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {places.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
            <MapPinOff className="w-8 h-8 mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-zinc-300">Ничего не найдено</p>
            <p className="text-xs text-zinc-500 mt-0.5">Попробуйте изменить категорию или поисковый запрос</p>
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