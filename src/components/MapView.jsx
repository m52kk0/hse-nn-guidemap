import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { handleImageFallback } from '../utils/imageFallback.js';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
                  src={place.imageUrl}
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
