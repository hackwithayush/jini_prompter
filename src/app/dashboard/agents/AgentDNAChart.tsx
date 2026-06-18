"use client";

import React from 'react';

interface DNA {
  Creativity: number;
  Reasoning: number;
  Business: number;
  Technical: number;
  Research: number;
  Communication: number;
}

interface Props {
  dna: DNA;
  compact?: boolean;
}

const colors: Record<keyof DNA, string> = {
  Creativity: '#e879f9',    // Pink
  Reasoning: '#38bdf8',     // Light Blue
  Business: '#fbbf24',      // Yellow
  Technical: '#a3e635',     // Lime
  Research: '#818cf8',      // Indigo
  Communication: '#fb7185', // Rose
};

export function AgentDNAChart({ dna, compact = false }: Props) {
  const traits = Object.entries(dna) as [keyof DNA, number][];

  if (compact) {
    return (
      <div className="flex gap-1 h-8 items-end w-full">
        {traits.map(([key, value]) => (
          <div key={key} className="flex-1 flex flex-col justify-end h-full gap-1 group relative">
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {key}: {value}
            </div>
            <div 
              className="w-full rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ height: `${Math.max(value, 10)}%`, backgroundColor: colors[key] }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {traits.map(([key, value]) => (
        <div key={key} className="flex items-center gap-3">
          <div className="w-24 text-xs text-zinc-400 font-medium">{key}</div>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full"
              style={{ width: `${value}%`, backgroundColor: colors[key] }}
            />
          </div>
          <div className="w-8 text-right text-xs font-bold text-white">{value}</div>
        </div>
      ))}
    </div>
  );
}
