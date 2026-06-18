'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Sparkles, X, UploadCloud, Loader2 } from 'lucide-react';
import { useBlueprint } from '@/lib/context/BlueprintContext';
import { optimizeImage, stageImage } from '@/lib/utils/imageOptimization';

const CATEGORIES = ['Marketing', 'Creative', 'Legal', 'Startup', 'Agent'];
const PLACEHOLDERS = [
  'An AI Startup',
  'A SaaS Business',
  'A Marketing Campaign',
  'A YouTube Channel',
  'A Mobile App',
  'An AI Agent',
];

interface SimpleAgent {
  id: string;
  name: string;
  category: string | null;
}

export function WishBox() {
  const { wish, setWish, selectedAgentId, setSelectedAgentId, pastedImage, setPastedImage, submitWish, isLoading } = useBlueprint();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [agents, setAgents] = useState<{ templates: SimpleAgent[], userAgents: SimpleAgent[] }>({ templates: [], userAgents: [] });
  const [isStaging, setIsStaging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    import('@/app/actions/agents').then(({ getAvailableAgents }) => {
      getAvailableAgents().then(setAgents);
    });
  }, []);

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (cat: string) => {
    if (activeCategory === cat) {
      setActiveCategory(null);
    } else {
      setActiveCategory(cat);
    }
  };

  const processImageFile = async (file: File) => {
    try {
      setIsStaging(true);
      const optimized = await optimizeImage(file);
      const url = await stageImage(optimized);
      setPastedImage(url);
    } catch (error) {
      console.error("Failed to stage image:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsStaging(false);
    }
  };

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          processImageFile(file);
        }
        break;
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processImageFile(file);
      }
    }
  }, []);

  const removeImage = useCallback(() => {
    setPastedImage(null);
  }, [setPastedImage]);

  return (
    <div className="w-full relative group">
      {/* Animated gradient border */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#9d4edd]/20 via-[#eab308]/20 to-[#9d4edd]/20 opacity-50 blur-xl group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Inner card */}
      <div className="relative rounded-2xl bg-[#18181b] border border-[#9d4edd]/20 p-4 md:p-6 overflow-hidden shadow-2xl flex flex-col gap-4">
        
        {/* Top Controls: Categories and Agent Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                activeCategory === 'Code'
                  ? 'bg-[#9d4edd] text-white border-transparent'
                  : 'bg-[#09090b] text-[#c4b5fd] border-[#9d4edd]/30 hover:border-[#9d4edd]'
              }`}
              onClick={() => handleCategoryClick('Code')}
            >
              ✦ Code
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  activeCategory === cat
                    ? 'bg-[#9d4edd] text-white border-transparent'
                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600'
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <select 
            className="bg-[#09090b] border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#9d4edd] min-w-[200px]"
            value={selectedAgentId || ''}
            onChange={(e) => setSelectedAgentId(e.target.value || null)}
          >
            <option value="">Auto (Blueprint Architect)</option>
            {agents.userAgents.length > 0 && (
              <optgroup label="My Forge">
                {agents.userAgents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </optgroup>
            )}
            {agents.templates.length > 0 && (
              <optgroup label="JINI Templates">
                {agents.templates.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </optgroup>
            )}
          </select>
        </div>

        {/* Textarea & Dropzone */}
        <div 
          className={`relative border-2 border-dashed rounded-xl transition-all ${isDragging ? 'border-[#9d4edd] bg-[#9d4edd]/10' : 'border-transparent'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <textarea
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            onPaste={handlePaste}
            className={`w-full bg-[#09090b]/50 border border-zinc-800 rounded-xl p-4 text-white text-lg placeholder-transparent focus:outline-none focus:border-[#9d4edd]/50 focus:ring-1 focus:ring-[#9d4edd]/50 transition-all resize-none ${pastedImage || isStaging ? 'min-h-[220px] pb-24' : 'h-32'}`}
          />
          {isStaging && (
            <div className="absolute bottom-4 left-4 flex items-center bg-black/60 rounded-lg border border-[#9d4edd]/30 p-2 text-xs text-[#c4b5fd]">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Optimizing & Staging...
            </div>
          )}
          {!isStaging && pastedImage && (
            <div className="absolute bottom-4 left-4 group">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-[#9d4edd]/30 bg-black/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pastedImage} alt="Pasted attachment" className="w-full h-full object-cover" />
                <button 
                  onClick={removeImage}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}
          
          <div className="absolute top-4 right-4 text-zinc-600 opacity-50 pointer-events-none flex flex-col items-end">
            <UploadCloud className="w-6 h-6 mb-1" />
            <span className="text-[10px]">Drop image here</span>
          </div>
          {/* Rotating placeholder (only visible if textarea is empty) */}
          <AnimatePresence mode="wait">
            {wish.length === 0 && (
              <motion.div
                key={placeholderIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 left-4 text-zinc-500 text-lg pointer-events-none"
              >
                What do you wish to create? <br />
                <span className="text-zinc-600">e.g., {PLACEHOLDERS[placeholderIndex]}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <Button 
          variant="primary" 
          className="w-full text-lg py-6 shadow-[#9d4edd]/20"
          onClick={submitWish}
          disabled={isLoading || wish.length === 0}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">✦</span> Weaving magic...
            </span>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Grant my wish
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
