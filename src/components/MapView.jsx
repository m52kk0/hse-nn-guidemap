import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix standard Leaflet marker icons when bundling with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to smoothly center map on selected place
function MapController({ selectedPlace }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace && selectedPlace.coords) {
      map.flyTo(selectedPlace.coords, 15, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [selectedPlace, map]);

  return null;
}

export default function MapView({ places, selectedPlace, onSelectPlace }) {
  const defaultCenter = [56.3269, 44.0059]; // Nizhny Novgorod center
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
              <div className="w-56 p-1">
                <img
                  src={place.imageUrl}
                  alt={place.title}
                  className="w-full h-28 object-cover rounded-lg mb-2"
                />
                <h4 className="font-bold text-sm text-slate-900 mb-1 leading-snug">
                  {place.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                  {place.description}
                </p>
                {place.foodNearby && place.foodNearby[0] && (
                  <div className="text-[11px] bg-slate-100 p-1.5 rounded text-slate-700">
                    🍔 Рядом: <span className="font-semibold">{place.foodNearby[0].name}</span> ({place.foodNearby[0].distance})
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
