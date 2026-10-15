import React, { useState } from 'react';
import { MapPin, Utensils, Camera, ChevronDown, ChevronUp } from 'lucide-react';

export default function PlaceCard({ place, isSelected, onSelect }) {
  const [showFood, setShowFood] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-2xl border transition-all duration-300 bg-white p-3 shadow-sm hover:shadow-md ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-blue-500/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
        <img
          src={place.imageUrl}
          alt={place.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
          <MapPin className="w-3 h-3 text-blue-400" />
          <span>{place.district}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
          {place.title}
        </h3>
        
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {place.description}
        </p>

        {place.photoTips && (
          <div className="bg-amber-50/80 border border-amber-200/60 rounded-lg p-2 flex items-start gap-2 text-[11px] text-amber-800">
            <Camera className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="line-clamp-2">
              <strong className="font-medium">Совет: </strong>{place.photoTips}
            </p>
          </div>
        )}

        {place.foodNearby && place.foodNearby.length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFood(!showFood);
              }}
              className="w-full flex items-center justify-between text-[11px] font-medium text-slate-500 hover:text-slate-800 py-1"
            >
              <span className="flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-blue-600" />
                Где перекусить рядом ({place.foodNearby.length})
              </span>
              {showFood ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showFood && (
              <div className="mt-1.5 space-y-1.5 bg-slate-50 rounded-lg p-2 border border-slate-100">
                {place.foodNearby.map((cafe, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-slate-800">{cafe.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({cafe.type})</span>
                    </div>
                    <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {cafe.distance}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
