import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Utensils, Camera, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';
import { handleImageFallback } from '../utils/imageFallback.js';

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
      className={`group cursor-pointer rounded-xl border p-3 transition-colors ${
        isSelected
          ? 'bg-zinc-800/90 border-[#3B6E75] ring-1 ring-[#3B6E75]'
          : 'bg-zinc-900 border-zinc-800 hover:border-[#3B6E75]/70'
      }`}
    >
      <div className="relative h-40 w-full rounded-lg overflow-hidden bg-zinc-950 mb-2.5">
        <img
          src={place.imageUrl}
          alt={place.title}
          onError={(e) => handleImageFallback(e, place.category)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-900/80 text-zinc-200 border border-zinc-700/70">
            {categoryLabel}
          </span>
          {place.district && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-900/80 text-zinc-300 border border-zinc-700/70 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#79c0c8]" />
              <span>{place.district}</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleVisitedClick}
          className={`absolute top-2 right-2 text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
            isVisited
              ? 'bg-[#3B6E75] text-white shadow-sm'
              : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/70'
          }`}
        >
          <Check className={`w-3.5 h-3.5 ${isVisited ? 'stroke-[2.5]' : 'opacity-70'}`} />
          <span>{isVisited ? 'Посещено' : 'Был здесь'}</span>
        </button>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-semibold text-zinc-100 text-sm sm:text-base leading-snug group-hover:text-[#79c0c8] transition-colors">
          {place.title}
        </h3>

        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {place.description}
        </p>

        {place.photoTips && (
          <div className="flex items-center gap-1 text-[11px] text-amber-300/80 truncate pt-0.5">
            <Camera className="w-3 h-3 shrink-0" />
            <span className="truncate">{place.photoTips}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleDetailsClick}
          className="flex-1 py-1.5 px-3 rounded-lg bg-[#3B6E75] hover:bg-[#488790] text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Подробнее</span>
        </button>

        {place.foodNearby && place.foodNearby.length > 0 && (
          <button
            type="button"
            onClick={handleFoodClick}
            className="py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1 border border-zinc-700/60"
          >
            <Utensils className="w-3.5 h-3.5 text-[#79c0c8]" />
            <span>Еда ({place.foodNearby.length})</span>
            {showFood ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {showFood && place.foodNearby && place.foodNearby.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-zinc-800 space-y-1.5">
          {place.foodNearby.map((cafe, idx) => (
            <div
              key={idx}
              className="text-xs p-2 rounded bg-zinc-850 border border-zinc-800 flex items-center justify-between"
            >
              <div>
                <span className="font-medium text-zinc-200">{cafe.name}</span>
                <span className="text-zinc-500 text-[11px] ml-1.5">({cafe.type})</span>
              </div>
              <span className="text-[11px] text-[#79c0c8] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                {cafe.distance}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
