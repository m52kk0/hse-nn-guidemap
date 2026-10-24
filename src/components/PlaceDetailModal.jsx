import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  MapPin,
  Utensils,
  Camera,
  Map,
  Check,
  Navigation,
} from 'lucide-react';
import { handleImageFallback, getSafeImageUrl } from '../utils/imageFallback.js';

const CATEGORY_NAMES = {
  architecture: 'Архитектура',
  view: 'Смотровые',
  art: 'Стрит-арт',
  photo: 'Фотоспоты',
};

export default function PlaceDetailModal({
  place,
  isOpen,
  onClose,
  onSelect,
  isVisited,
  onToggleVisited,
}) {
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

  const categoryLabel = CATEGORY_NAMES[place.category] || place.category;

  const yandexRouteUrl = place.coords
    ? `https://yandex.ru/maps/?rtext=~${place.coords[0]},${place.coords[1]}&rtt=pd`
    : `https://yandex.ru/maps/?text=${encodeURIComponent('Нижний Новгород ' + place.title)}`;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[90vh] bg-zinc-900 text-zinc-100 rounded-t-3xl sm:rounded-2xl border-t sm:border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ручка шторки для мобилок */}
        <div className="sm:hidden w-10 h-1 bg-zinc-600 rounded-full mx-auto my-2 shrink-0" />

        {/* Кнопка закрытия */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center border border-zinc-700/80 transition-transform active:scale-90 shadow-md backdrop-blur-sm"
          title="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Шапка с фото */}
        <div className="relative h-48 sm:h-64 w-full shrink-0 bg-zinc-950 overflow-hidden">
          <img
            src={getSafeImageUrl(place.imageUrl)}
            alt={place.title}
            onError={(e) => handleImageFallback(e, place.category)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

          {/* Категория и Район */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap pr-12">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-900/90 text-zinc-200 border border-zinc-700/80 backdrop-blur-sm">
              {categoryLabel}
            </span>
            {place.district && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-900/90 text-zinc-300 border border-zinc-700/80 flex items-center gap-1 backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-[#79c0c8]" />
                <span>{place.district}</span>
              </span>
            )}
          </div>

          {/* Название и статус посещения */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2.5">
            <div className="min-w-0 pr-2">
              <h2 className="text-lg sm:text-2xl font-bold text-white leading-tight">
                {place.title}
              </h2>
              {place.coords && (
                <p className="text-[11px] sm:text-xs text-zinc-300 mt-0.5">
                  Координаты: {place.coords[0]}, {place.coords[1]}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onToggleVisited}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border shadow-sm backdrop-blur-sm active:scale-95 ${
                isVisited
                  ? 'bg-[#3B6E75] border-[#3B6E75] text-white'
                  : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border-zinc-700/80'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${isVisited ? 'stroke-[2.5]' : 'opacity-70'}`} />
              <span>{isVisited ? 'Посещено' : 'Отметить посещение'}</span>
            </button>
          </div>
        </div>

        {/* Контент модалки со скроллом */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#79c0c8] mb-1.5">
              О локации
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {place.description}
            </p>
          </div>

          {place.photoTips && (
            <div className="bg-amber-950/20 border border-amber-600/30 rounded-xl p-3 sm:p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-amber-200">Совет для фото</h4>
                <p className="text-xs text-amber-100/90 mt-0.5 leading-relaxed">
                  {place.photoTips}
                </p>
              </div>
            </div>
          )}

          {place.foodNearby && place.foodNearby.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-4 h-4 text-[#79c0c8]" />
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-100">
                  Где перекусить рядом ({place.foodNearby.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {place.foodNearby.map((cafe, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-zinc-100 text-xs sm:text-sm">{cafe.name}</h4>
                        <span className="text-[11px] font-medium text-[#79c0c8] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700/60 shrink-0">
                          {cafe.distance}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs mt-1">{cafe.address}</p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-zinc-750 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>{cafe.type}</span>
                      <span className="text-zinc-300 font-medium">{cafe.avgBill}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Нижняя панель действий */}
        <div className="p-3 sm:p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <a
            href={yandexRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs sm:text-sm font-medium transition-colors active:scale-98"
          >
            <Navigation className="w-3.5 h-3.5 text-[#79c0c8]" />
            <span>Маршрут в Яндекс Картах</span>
          </a>

          <button
            type="button"
            onClick={() => {
              if (onSelect) onSelect(place);
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B6E75] hover:bg-[#488790] text-white text-xs sm:text-sm font-medium transition-colors active:scale-98 shadow-md shadow-[#3B6E75]/20"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Показать на карте</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
