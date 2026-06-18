'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

export function FeedbackWidget({ blueprintId, initialRating }: { blueprintId?: string | null, initialRating?: boolean | null }) {
  const [rating, setRating] = useState<boolean | null>(initialRating ?? null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRate = async (isPositive: boolean) => {
    setIsLoading(true);
    try {
      if (!blueprintId) {
        // Demo mode simulation
        await new Promise(r => setTimeout(r, 600));
        setRating(isPositive);
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blueprintId, userRating: isPositive })
      });
      if (res.ok) {
        setRating(isPositive);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 mr-1">Rate Output:</span>
      <button 
        onClick={(e) => { e.preventDefault(); handleRate(true); }}
        disabled={isLoading}
        className={`p-1.5 rounded-md transition-colors ${rating === true ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:text-emerald-400 hover:bg-white/5'}`}
        title="Good response"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); handleRate(false); }}
        disabled={isLoading}
        className={`p-1.5 rounded-md transition-colors ${rating === false ? 'bg-red-500/20 text-red-400' : 'text-zinc-500 hover:text-red-400 hover:bg-white/5'}`}
        title="Bad response"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
      {isLoading && <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />}
    </div>
  );
}
