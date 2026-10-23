import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { handleImageFallback, getSafeImageUrl } from '../utils/imageFallback.js';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Цвета меток под категории (ключи = category в places.json)
const CATEGORY_COLORS = {
  view: '#F97316',         // оранжевый: смотровые / закаты
  art: '#8B5CF6',          // фиолетовый: стрит-арт
  architecture: '#3B82F6', // синий: архитектура
  photo: '#EC4899',        // розовый: фотолокации
};
const DEFAULT_COLOR = '#6B7280';

// Иконка-пин нужного цвета (чистый SVG, без картинок)
const makeIcon = (color) =>
  L.divIcon({
    className: '',
    html: `
      <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg"
           style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.45));">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 11 15 27 15 27s15-16 15-27C30 6.7 23.3 0 15 0z"
              fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="15" cy="15" r="5.5" fill="white"/>
      </svg>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42], // кончик пина = координата точки
    popupAnchor: [0, -38],
  });

// Создаём иконки один раз, а не при каждом рендере
const ICONS = Object.fromEntries(
  Object.entries(CATEGORY_COLORS).map(([cat, color]) => [cat, makeIcon(color)])
);
const DEFAULT_ICON = makeIcon(DEFAULT_COLOR);

function MapController({ selectedPlace }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace && selectedPlace.coords) {
      map.flyTo(selectedPlace.coords, 15, {
        duration: 1.2,
      });
    }
  }, [selectedPlace, map]);

  return null;
}

export default function MapView({ places, selectedPlace, onSelectPlace, onOpenDetails }) {
  const defaultCenter = [56.3269, 44.0059];
  const markerRefs = useRef({});

  useEffect(() => {
    if (selectedPlace && markerRefs.current[selectedPlace.id]) {
      markerRefs.current[selectedPlace.id].openPopup();
    }
  }, [selectedPlace]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedPlace={selectedPlace} />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.coords}
            icon={ICONS[place.category] || DEFAULT_ICON}
            ref={(ref) => {
              if (ref) markerRefs.current[place.id] = ref;
            }}
            eventHandlers={{
              click: () => onSelectPlace(place),
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="w-56 p-1 text-zinc-100">
                <img
                  src={getSafeImageUrl(place.imageUrl)}
                  alt={place.title}
                  onError={(e) => handleImageFallback(e, place.category)}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <h4 className="font-semibold text-xs sm:text-sm text-zinc-100 mb-1 leading-snug">
                  {place.title}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2 leading-relaxed">
                  {place.description}
                </p>

                {place.foodNearby && place.foodNearby[0] && (
                  <div className="text-[10px] bg-zinc-800 text-zinc-300 p-1.5 rounded mb-2 border border-zinc-700/60">
                    🍔 Рядом: <span className="text-zinc-200 font-medium">{place.foodNearby[0].name}</span> ({place.foodNearby[0].distance})
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenDetails) {
                      onOpenDetails(place);
                    }
                  }}
                  className="w-full py-1 px-2 bg-[#3B6E75] hover:bg-[#488790] text-white text-[11px] font-medium rounded transition-colors"
                >
                  Подробнее
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}