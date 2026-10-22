import React from 'react';
import { Compass, CheckCircle2 } from 'lucide-react';

export default function Header({ totalPlaces, visitedCount = 0 }) {
  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#3B6E75] flex items-center justify-center text-white">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-semibold text-zinc-100 flex items-center gap-2">
            Нижний Новгород
            <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-zinc-800 text-[#71b1b9] border border-zinc-700">
              Путеводитель
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="text-zinc-400 hidden sm:block">
          Локаций в базе: <span className="text-zinc-200 font-medium">{totalPlaces}</span>
        </div>
        {visitedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#3B6E75]/20 text-[#8ec8ce] border border-[#3B6E75]/40 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Посещено: {visitedCount}</span>
          </div>
        )}
      </div>
    </header>
  );
}
