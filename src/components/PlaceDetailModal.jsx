import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  MapPin,
  Utensils,
  Camera,
  ExternalLink,
  Map,
  Check,
  Navigation,
  Compass,
} from 'lucide-react';
import { handleImageFallback } from '../utils/imageFallback.js';

const CATEGORY_MAP = {
  architecture: {
    label: 'Архитектура',
    badgeClass: 'bg-indigo-950/80 text-indigo-200 border border-indigo-400/30',
  },
  view: {
    label: 'Видовая точка',
    badgeClass: 'bg-emerald-950/80 text-emerald-200 border border-emerald-400/30',
  },
  art: {
    label: 'Арт и дворы',
    badgeClass: 'bg-purple-950/80 text-purple-200 border border-purple-400/30',
  },
  photo: {
    label: 'Фотоспот',
    badgeClass: 'bg-amber-950/80 text-amber-200 border border-amber-400/30',
  },
};

export default function PlaceDetailModal({
  place,
  isOpen,
  onClose,
  onSelect,
  isVisited,
  onToggleVisited,
}) {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !place) return null;

  const categoryInfo = CATEGORY_MAP[place.category] || {
    label: place.category,
    badgeClass: 'bg-slate-900/80 text-slate-200 border border-slate-400/30',
  };

  const yandexRouteUrl = place.coords
    ? `https://yandex.ru/maps/?rtext=~${place.coords[0]},${place.coords[1]}&rtt=pd`
    : `https://yandex.ru/maps/?text=${encodeURIComponent('Нижний Новгород ' + place.title)}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-place-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-gradient-to-b from-[#1a3337] to-[#122325] text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#3B6E75]/60 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md flex items-center justify-center transition-colors shadow-lg active:scale-95 border border-white/10"
          aria-label="Закрыть модальное окно"
        >
          <X className="w-5 h-5 text-slate-300 hover:text-white" />
        </button>

        {/* Modal Header with Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-slate-950 overflow-hidden">
          <img
            src={place.imageUrl}
            alt={place.title}
            onError={(e) => handleImageFallback(e, place.category)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a3337] via-[#1a3337]/50 to-transparent" />

          {/* Badges and Visited Button */}
          <div className="absolute top-4 left-4 right-16 flex items-center justify-between gap-2 pointer-events-none">
            <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${categoryInfo.badgeClass}`}
              >
                {categoryInfo.label}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white flex items-center gap-1 shadow-sm border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-cyan-300" />
                {place.district}
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleVisited}
              className={`pointer-events-auto flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all shadow-md active:scale-95 border ${
                isVisited
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30 ring-2 ring-emerald-300'
                  : 'bg-slate-950/75 hover:bg-slate-950 text-white border-white/20 backdrop-blur-md'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${isVisited ? 'stroke-[3]' : 'opacity-80'}`} />
              <span>{isVisited ? 'Посещено' : 'Был здесь'}</span>
            </button>
          </div>

          {/* Title on the photo */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2
              id="modal-place-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-md text-white"
            >
              {place.title}
            </h2>
            {place.coords && (
              <p className="text-xs text-cyan-200/80 flex items-center gap-1 mt-1 drop-shadow">
                <Compass className="w-3.5 h-3.5 text-cyan-300" />
                Координаты: {place.coords[0]}, {place.coords[1]}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Full Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300/80 mb-2">
              О локации
            </h3>
            <p className="text-sm sm:text-base text-slate-100/90 leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Photo Tips Box */}
          {place.photoTips && (
            <div className="bg-amber-400/15 border border-amber-300/30 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Camera className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wide text-amber-200">
                  Совет для идеального кадра
                </h4>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                  {place.photoTips}
                </p>
              </div>
            </div>
          )}

          {/* Food Nearby Section */}
          {place.foodNearby && place.foodNearby.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#3B6E75]/40 text-cyan-300 flex items-center justify-center border border-[#3B6E75]/60">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Где перекусить рядом ({place.foodNearby.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {place.foodNearby.map((cafe, idx) => {
                  const yandexSearchUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(
                    `Нижний Новгород ${cafe.name} ${cafe.address}`
                  )}`;

                  return (
                    <div
                      key={idx}
                      className="bg-[#0d191b]/80 hover:bg-[#091315] border border-[#3B6E75]/50 rounded-2xl p-3.5 flex flex-col justify-between transition-colors shadow-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-white text-sm leading-snug">
                            {cafe.name}
                          </h4>
                          <span className="text-[11px] font-semibold text-cyan-200 bg-[#3B6E75]/50 border border-[#3B6E75] px-2 py-0.5 rounded-full shrink-0">
                            {cafe.distance}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="px-1.5 py-0.5 bg-white/10 text-slate-300 rounded text-[10px] font-medium">
                            {cafe.type}
                          </span>
                          <span className="truncate">{cafe.address}</span>
                        </div>
                      </div>

                      <a
                        href={yandexSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors self-start"
                      >
                        <span>Найти на Яндекс Картах</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#0d191b] border-t border-[#3B6E75]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={yandexRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#3B6E75]/60 bg-[#16292b] hover:bg-[#1f3a3d] text-slate-200 text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <Navigation className="w-4 h-4 text-cyan-300" />
            <span>Маршрут в Яндекс Картах</span>
          </a>

          <button
            type="button"
            onClick={() => {
              if (onSelect) onSelect(place);
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B6E75] hover:bg-[#488790] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#3B6E75]/40 active:scale-95"
          >
            <Map className="w-4 h-4" />
            <span>Показать на карте проекта</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
