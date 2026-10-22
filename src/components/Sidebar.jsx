import React from 'react';
import { Search, Map } from 'lucide-react';
import FilterTabs from './FilterTabs.jsx';
import PlaceCard from './PlaceCard.jsx';

export default function Sidebar({
  places,
  selectedPlace,
  onSelectPlace,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  // НОВЫЕ ПРОПСЫ:
  isRoutesTab,
  setIsRoutesTab,
  showFoodFilter,
  setShowFoodFilter,
}) {
  return (
    <aside className="w-full md:w-[420px] lg:w-[460px] h-full flex flex-col bg-slate-50/50 border-r border-slate-200 shrink-0">
      <div className="p-4 bg-white border-b border-slate-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по местам или описанию..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-150 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <FilterTabs
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          // ПЕРЕДАЕМ НОВЫЕ ПРОПСЫ:
          isRoutesTab={isRoutesTab}
          setIsRoutesTab={setIsRoutesTab}
          showFoodFilter={showFoodFilter}
          setShowFoodFilter={setShowFoodFilter}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {places.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Map className="w-10 h-10 mb-2 stroke-1" />
            <p className="text-sm font-medium">Ничего не найдено</p>
            <p className="text-xs">Попробуйте изменить запрос или фильтр</p>
          </div>
        ) : (
          places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isSelected={selectedPlace?.id === place.id}
              onSelect={() => onSelectPlace(place)}
            />
          ))
        )}
      </div>
    </aside>
  );
}