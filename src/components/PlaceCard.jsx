import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Utensils,
  Camera,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
} from 'lucide-react';
import PlaceDetailModal from './PlaceDetailModal.jsx';
import { handleImageFallback } from '../utils/imageFallback.js';

const STORAGE_KEY = 'nn_visited_places';

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

function getVisitedList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function PlaceCard({ place, isSelected, onSelect }) {
  const cardRef = useRef(null);
  const [showFood, setShowFood] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisited, setIsVisited] = useState(false);

  // Auto-scroll sidebar list to this card when selected from the map
  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSelected]);

  // Synchronize visited state with localStorage and custom/storage events
  useEffect(() => {
    const checkVisited = () => {
      const list = getVisitedList();
      setIsVisited(list.includes(place.id));
    };

    checkVisited();

    const handleCustomChange = (e) => {
      if (e.detail?.id === place.id) {
        setIsVisited(e.detail.isVisited);
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        checkVisited();
      }
    };

    window.addEventListener('nn_visited_change', handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('nn_visited_change', handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [place.id]);

  // Listen for Leaflet Popups opened on the map and inject action buttons
  useEffect(() => {
    const checkPopup = () => {
      const popups = document.querySelectorAll('.leaflet-popup');
      popups.forEach((popup) => {
        const titleEl = popup.querySelector('h4');
        if (titleEl && titleEl.textContent.trim() === place.title.trim()) {
          // If popup is for this place and actions are not yet injected
          if (!popup.querySelector(`[data-place-id="${place.id}"]`)) {
            const content =
              popup.querySelector('.leaflet-popup-content > div') ||
              popup.querySelector('.leaflet-popup-content');
            if (content) {
              const actionsDiv = document.createElement('div');
              actionsDiv.setAttribute('data-place-id', place.id);
              actionsDiv.className =
                'place-popup-actions mt-2.5 pt-2 border-t border-[#3B6E75]/50 flex items-center gap-1.5';

              const btnToCard = document.createElement('button');
              btnToCard.type = 'button';
              btnToCard.className =
                'flex-1 py-1.5 px-2 text-[11px] font-medium rounded-lg bg-[#214044] hover:bg-[#2c555a] text-cyan-200 border border-[#3B6E75]/60 transition-colors text-center cursor-pointer shadow-xs active:scale-95';
              btnToCard.innerText = 'К карточке';
              btnToCard.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(place);
                if (cardRef.current) {
                  cardRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                  cardRef.current.classList.add(
                    'ring-4',
                    'ring-cyan-300',
                    'shadow-2xl'
                  );
                  setTimeout(() => {
                    cardRef.current?.classList.remove(
                      'ring-4',
                      'ring-cyan-300',
                      'shadow-2xl'
                    );
                  }, 1800);
                }
              };

              const btnDetails = document.createElement('button');
              btnDetails.type = 'button';
              btnDetails.className =
                'flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-lg bg-[#3B6E75] hover:bg-[#468189] text-white border border-cyan-300/30 transition-colors text-center cursor-pointer shadow-xs active:scale-95';
              btnDetails.innerText = 'Подробнее';
              btnDetails.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              };

              actionsDiv.appendChild(btnToCard);
              actionsDiv.appendChild(btnDetails);
              content.appendChild(actionsDiv);
            }
          }
        }
      });
    };

    const observer = new MutationObserver(checkPopup);
    observer.observe(document.body, { childList: true, subtree: true });

    checkPopup();

    return () => {
      observer.disconnect();
    };
  }, [place, onSelect]);

  const handleToggleVisited = (e) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      const list = getVisitedList();
      const willBeVisited = !list.includes(place.id);
      const updated = willBeVisited
        ? [...list, place.id]
        : list.filter((id) => id !== place.id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setIsVisited(willBeVisited);

      window.dispatchEvent(
        new CustomEvent('nn_visited_change', {
          detail: { id: place.id, isVisited: willBeVisited },
        })
      );
    } catch (err) {
      console.error('Error updating visited state in localStorage', err);
    }
  };

  const categoryInfo = CATEGORY_MAP[place.category] || {
    label: place.category,
    badgeClass: 'bg-slate-900/80 text-slate-200 border border-slate-400/30',
  };

  return (
    <>
      <div
        ref={cardRef}
        onClick={onSelect}
        className={`group cursor-pointer rounded-2xl border transition-all duration-300 p-3.5 bg-gradient-to-br from-[#214044] via-[#1a3337] to-[#132629] text-white ${
          isSelected
            ? 'ring-2 ring-cyan-300 border-cyan-300 shadow-xl shadow-cyan-950/60'
            : 'border-[#3B6E75]/60 hover:border-[#529aa3] shadow-md'
        }`}
      >
        {/* Card Image and Badges */}
        <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-950/60 mb-3 border border-white/10">
          <img
            src={place.imageUrl}
            alt={place.title}
            onError={(e) => handleImageFallback(e, place.category)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

          {/* Top-left Badges: Category & District */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 max-w-[70%]">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md ${categoryInfo.badgeClass}`}
            >
              {categoryInfo.label}
            </span>
            <span className="bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white/10">
              <MapPin className="w-3 h-3 text-cyan-300" />
              <span>{place.district}</span>
            </span>
          </div>

          {/* Top-right "Был здесь" Button */}
          <button
            type="button"
            onClick={handleToggleVisited}
            className={`absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-all shadow-md active:scale-95 border ${
              isVisited
                ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30 ring-2 ring-emerald-300'
                : 'bg-slate-950/75 hover:bg-slate-950 text-white border-white/20 backdrop-blur-md'
            }`}
            title={isVisited ? 'Нажмите, чтобы снять отметку' : 'Отметить как посещенное'}
          >
            <Check className={`w-3 h-3 ${isVisited ? 'stroke-[3]' : 'opacity-80'}`} />
            <span>{isVisited ? 'Посещено' : 'Был здесь'}</span>
          </button>
        </div>

        {/* Card Content */}
        <div className="space-y-2.5">
          <h3 className="font-semibold text-white group-hover:text-cyan-200 transition-colors text-sm sm:text-base leading-snug drop-shadow-xs">
            {place.title}
          </h3>

          <p className="text-xs text-slate-100/90 line-clamp-2 leading-relaxed">
            {place.description}
          </p>

          {/* Photo Tips in Translucent Amber Style */}
          {place.photoTips && (
            <div className="bg-amber-400/15 border border-amber-300/30 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-amber-100 shadow-xs">
              <Camera className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
              <p className="line-clamp-2 leading-relaxed">
                <strong className="font-semibold text-amber-200">Совет: </strong>
                {place.photoTips}
              </p>
            </div>
          )}

          {/* Food Nearby Accordion */}
          {place.foodNearby && place.foodNearby.length > 0 && (
            <div className="pt-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFood(!showFood);
                }}
                className="w-full flex items-center justify-between text-[11px] font-medium text-cyan-100/90 hover:text-white py-1 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-cyan-300" />
                  Где перекусить рядом ({place.foodNearby.length})
                </span>
                {showFood ? (
                  <ChevronUp className="w-3.5 h-3.5 text-cyan-200/70" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-200/70" />
                )}
              </button>

              {showFood && (
                <div className="mt-1.5 space-y-1.5 bg-[#0d191b]/70 rounded-xl p-2.5 border border-[#3B6E75]/40 animate-fadeIn">
                  {place.foodNearby.map((cafe, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-white/10 last:border-0"
                    >
                      <div className="truncate pr-2">
                        <span className="font-medium text-white">
                          {cafe.name}
                        </span>
                        <span className="text-[10px] text-slate-300 ml-1.5 px-1.5 py-0.5 bg-white/10 rounded">
                          {cafe.type}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-cyan-200 bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.5 rounded shrink-0">
                        {cafe.distance}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Detailed Modal Trigger Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="w-full mt-2.5 py-2 px-3 text-xs font-semibold rounded-xl text-white bg-[#3B6E75] hover:bg-[#468189] active:scale-[0.98] border border-cyan-300/20 flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Info className="w-3.5 h-3.5 text-cyan-200" />
            <span>Подробнее о локации</span>
          </button>
        </div>
      </div>

      {/* Detail Modal Portal */}
      <PlaceDetailModal
        place={place}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={onSelect}
        isVisited={isVisited}
        onToggleVisited={handleToggleVisited}
      />
    </>
  );
}
