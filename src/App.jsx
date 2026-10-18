import React, { useState, useMemo } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import MapView from './components/MapView.jsx';
import PlaceDetailModal from './components/PlaceDetailModal.jsx';
import rawPlaces from './data/places.json';
import { Map, List } from 'lucide-react';

const VISITED_STORAGE_KEY = 'nn_visited_places';

function loadVisitedPlaces() {
  try {
    const data = localStorage.getItem(VISITED_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalPlace, setModalPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileView, setMobileView] = useState('list');
  const [visitedIds, setVisitedIds] = useState(loadVisitedPlaces);

  const toggleVisited = (id) => {
    setVisitedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const filteredPlaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return rawPlaces.filter((place) => {
      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
      const matchesSearch =
        !query ||
        place.title.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query) ||
        (place.district && place.district.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    if (window.innerWidth < 768) {
      setMobileView('map');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Header
        totalPlaces={rawPlaces.length}
        visitedCount={visitedIds.length}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <div
          className={`h-full md:block ${
            mobileView === 'list' ? 'block w-full' : 'hidden'
          } md:w-auto z-10`}
        >
          <Sidebar
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={handleSelectPlace}
            onOpenDetails={(place) => setModalPlace(place)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            visitedIds={visitedIds}
            onToggleVisited={toggleVisited}
          />
        </div>

        <main
          className={`flex-1 h-full relative ${
            mobileView === 'map' ? 'block w-full' : 'hidden'
          } md:block`}
        >
          <MapView
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={handleSelectPlace}
            onOpenDetails={(place) => setModalPlace(place)}
          />
        </main>
      </div>

      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
          className="flex items-center gap-2 bg-[#3B6E75] hover:bg-[#488790] text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-black/50 text-sm transition-colors"
        >
          {mobileView === 'list' ? (
            <>
              <Map className="w-4 h-4" />
              <span>Карта</span>
            </>
          ) : (
            <>
              <List className="w-4 h-4" />
              <span>Список мест</span>
            </>
          )}
        </button>
      </div>

      {modalPlace && (
        <PlaceDetailModal
          place={modalPlace}
          isOpen={Boolean(modalPlace)}
          onClose={() => setModalPlace(null)}
          onSelect={handleSelectPlace}
          isVisited={visitedIds.includes(modalPlace.id)}
          onToggleVisited={() => toggleVisited(modalPlace.id)}
        />
      )}
    </div>
  );
}
