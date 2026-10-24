import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Utensils, Camera, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';
import { handleImageFallback, getSafeImageUrl } from '../utils/imageFallback.js';

const CATEGORY_NAMES = {
  architecture: 'Архитектура',
  view: 'Смотровые',
  art: 'Стрит-арт',
  photo: 'Фотоспоты',
};

export default function PlaceCard({
  place,
  isSelected,
  onSelect,
  onOpenDetails,
  isVisited,
  onToggleVisited,
}) {
  const cardRef = useRef(null);
  const [showFood, setShowFood] = useState(false);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(place);
    }
  };

  const handleVisitedClick = (e) => {
    e.stopPropagation();
    if (onToggleVisited) {
      onToggleVisited();
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    if (onOpenDetails) {
      onOpenDetails();
    }
  };

  const handleFoodClick = (e) => {
    e.stopPropagation();
    setShowFood(!showFood);
  };

  const categoryLabel = CATEGORY_NAMES[place.category] || place.category;

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`group cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 ${
        isSelected
          ? 'bg-zinc-850 border-[#3B6E75] ring-2 ring-[#3B6E75]/50 shadow-lg shadow-black/40'
          : 'bg-zinc-900 border-zinc-800 hover:border-[#3B6E75]/70 hover:bg-zinc-850/60'
      }`}
    >
      <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-zinc-950 mb-3">
        <img
          src={getSafeImageUrl(place.imageUrl)}
          alt={place.title}
          onError={(e) => handleImageFallback(e, place.category)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-900/90 text-zinc-100 border border-zinc-700/80 shadow-sm backdrop-blur-sm">
            {categoryLabel}
          </span>
          {place.district && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-900/90 text-zinc-200 border border-zinc-700/80 flex items-center gap-1 shadow-sm backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-[#79c0c8]" />
              <span>{place.district}</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleVisitedClick}
          className={`absolute top-2.5 right-2.5 text-xs sm:text-[13px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm backdrop-blur-sm ${
            isVisited
              ? 'bg-[#3B6E75] text-white'
              : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80'
          }`}
        >
          <Check className={`w-3.5 h-3.5 ${isVisited ? 'stroke-[2.5]' : 'opacity-70'}`} />
          <span>{isVisited ? 'Посещено' : 'Был здесь'}</span>
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-zinc-100 text-base sm:text-lg leading-snug group-hover:text-[#79c0c8] transition-colors">
          {place.title}
        </h3>

        <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
          {place.description}
        </p>

        {place.photoTips && (
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium truncate pt-1">
            <Camera className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">{place.photoTips}</span>
          </div>
        )}
      </div>

      <div className="mt-3.5 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={handleDetailsClick}
          className="flex-1 py-2 px-3.5 rounded-xl bg-[#3B6E75] hover:bg-[#488790] text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Info className="w-4 h-4" />
          <span>Подробнее</span>
        </button>

        {place.foodNearby && place.foodNearby.length > 0 && (
          <button
            type="button"
            onClick={handleFoodClick}
            className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 border border-zinc-700/80"
          >
            <Utensils className="w-3.5 h-3.5 text-[#79c0c8]" />
            <span>Еда ({place.foodNearby.length})</span>
            {showFood ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {showFood && place.foodNearby && place.foodNearby.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-zinc-800 space-y-2">
          {place.foodNearby.map((cafe, idx) => (
            <div
              key={idx}
              className="text-xs sm:text-sm p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-750 flex items-center justify-between"
            >
              <div>
                <span className="font-medium text-zinc-200">{cafe.name}</span>
                <span className="text-zinc-400 text-xs ml-1.5">({cafe.type})</span>
              </div>
              <span className="text-xs text-[#79c0c8] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 font-medium">
                {cafe.distance}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
