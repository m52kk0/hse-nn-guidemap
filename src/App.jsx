import React, { useState, useMemo } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import MapView from './components/MapView.jsx';
import rawPlaces from './data/places.json';
import { Map, List } from 'lucide-react';

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'map' for small screens

  // Filter places based on search query and category
  const filteredPlaces = useMemo(() => {
    return rawPlaces.filter((place) => {
      const matchesCategory =
        selectedCategory === 'all' || place.category === selectedCategory;
      const matchesSearch =
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    // On mobile, automatically switch to map view when place is clicked
    if (window.innerWidth < 768) {
      setMobileView('map');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden">
      {/* Top Header */}
      <Header totalPlaces={rawPlaces.length} />

      {/* Main Split Screen Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar (Desktop: always visible, Mobile: toggled by tab) */}
        <div
          className={`h-full md:block ${
            mobileView === 'list' ? 'block w-full' : 'hidden'
          } md:w-auto z-10`}
        >
          <Sidebar
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={handleSelectPlace}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Right Map Container */}
        <main
          className={`flex-1 h-full relative ${
            mobileView === 'map' ? 'block w-full' : 'hidden'
          } md:block`}
        >
          <MapView
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlace}
          />
        </main>
      </div>

      {/* Mobile Floating Toggle Button */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-full font-medium shadow-2xl shadow-slate-900/40 text-sm active:scale-95 transition-transform"
        >
          {mobileView === 'list' ? (
            <>
              <Map className="w-4 h-4 text-blue-400" />
              <span>Показать карту</span>
            </>
          ) : (
            <>
              <List className="w-4 h-4 text-blue-400" />
              <span>Показать список</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
