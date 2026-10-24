import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Header({ visitedCount = 0 }) {
  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
      {/* Левая часть: чистый лаконичный типографический логотип */}
      <div className="flex flex-col">
        <h1 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight leading-tight">
          Нижний Новгород
        </h1>
        <span className="text-[11px] font-medium text-[#79c0c8] tracking-wider uppercase leading-none mt-0.5">
          Атмосферный гид
        </span>
      </div>

      {/* Правая часть: только счетчик посещенных мест, если есть */}
      <div className="flex items-center gap-3 text-xs">
        {visitedCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B6E75]/20 text-[#8ec8ce] border border-[#3B6E75]/40 font-medium shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Посещено: {visitedCount}</span>
          </div>
        )}
      </div>
    </header>
  );
}
