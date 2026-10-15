import React from 'react';
import { Compass, MapPin } from 'lucide-react';

export default function Header({ totalPlaces }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
            Нижний Новгород <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold border border-blue-200">Гид</span>
          </h1>
          <p className="text-xs text-slate-500">Интерактивная карта атмосферных мест</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
        <MapPin className="w-4 h-4 text-blue-600" />
        <span>Локаций в базе: <strong className="text-slate-900">{totalPlaces}</strong></span>
      </div>
    </header>
  );
}
