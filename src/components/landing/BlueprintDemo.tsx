'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Cpu, List, Map, X, UploadCloud, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  SAMPLE_BLUEPRINT_INPUT,
  SAMPLE_BLUEPRINT_SECTIONS,
} from '@/lib/mock-data';
import { logger } from '@/utils/logger';
import { staggeredExecution } from '@/utils/requestQueue';
import { optimizeImage, stageImage } from '@/lib/utils/imageOptimization';

// Tab Configuration

const TABS = [
  { key: 'executiveSummary', label: 'Executive Summary', icon: FileCode },
  { key: 'architecture', label: 'Architecture', icon: Cpu },
  { key: 'features', label: 'Features', icon: List },
  { key: 'roadmap', label: 'Roadmap', icon: Map },
] as const;

type TabKey = (typeof TABS)[number]['key'];

// Markdown Renderer — lightweight inline parser

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // H1
    if (line.startsWith('# ')) {
      return (
        <h3
          key={i}
          className="text-xl font-bold text-white mt-4 mb-2 first:mt-0"
        >
          {line.slice(2)}
        </h3>
      );
    }
    // H2
    if (line.startsWith('## ')) {
      return (
        <h4 key={i} className="text-lg font-semibold text-white mt-4 mb-2">
          {line.slice(3)}
        </h4>
      );
    }
    // H3
    if (line.startsWith('### ')) {
      return (
        <h5
          key={i}
          className="text-base font-semibold text-indigo-300 mt-3 mb-1"
        >
          {line.slice(4)}
        </h5>
      );
    }
    // Bullet
    if (line.startsWith('- ')) {
      return (
        <div key={i} className="flex items-start gap-2 ml-2 my-0.5">
          <span className="text-indigo-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
          <span className="text-zinc-300 text-sm leading-relaxed">
            {renderInline(line.slice(2))}
          </span>
        </div>
      );
    }
    // Numbered list
    const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
    if (numberedMatch) {
      return (
        <div key={i} className="flex items-start gap-2 ml-2 my-0.5">
          <span className="text-indigo-400 text-sm font-mono shrink-0 w-5 text-right">
            {numberedMatch[1]}.
          </span>
          <span className="text-zinc-300 text-sm leading-relaxed">
            {renderInline(numberedMatch[2])}
          </span>
        </div>
      );
    }
    // Empty
    if (line.trim() === '') return <div key={i} className="h-2" />;
    // Paragraph
    return (
      <p key={i} className="text-zinc-400 text-sm leading-relaxed my-1">
        {renderInline(line)}
      </p>
    );
  });
}

/** Render bold / code inline */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Typewriter Hook (Removed: Vercel AI SDK handles streaming natively)

import { useCompletion } from '@ai-sdk/react';

// BlueprintDemo Component

export function BlueprintDemo() {
  const [activeTab, setActiveTab] = useState<TabKey>('executiveSummary');
  const [prompt, setPrompt] = useState(SAMPLE_BLUEPRINT_INPUT);
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [isStaging, setIsStaging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleError = (error: Error) => {
    logger.error('Generation Error', error);
    alert("Generation Error: " + error.message);
  };

  const executiveSummary = useCompletion({ api: '/api/generate/section', onError: handleError });
  const architecture = useCompletion({ api: '/api/generate/section', onError: handleError });
  const features = useCompletion({ api: '/api/generate/section', onError: handleError });
  const roadmap = useCompletion({ api: '/api/generate/section', onError: handleError });

  const isGenerating = executiveSummary.isLoading || architecture.isLoading || features.isLoading || roadmap.isLoading;
  const hasGenerated = !!executiveSummary.completion || !!architecture.completion || !!features.completion || !!roadmap.completion;

  const getActiveCompletion = () => {
    switch (activeTab) {
      case 'executiveSummary': return executiveSummary.completion;
      case 'architecture': return architecture.completion;
      case 'features': return features.completion;
      case 'roadmap': return roadmap.completion;
      default: return "";
    }
  };

  const currentContent = getActiveCompletion() || (!hasGenerated && !isGenerating ? SAMPLE_BLUEPRINT_SECTIONS[activeTab as keyof typeof SAMPLE_BLUEPRINT_SECTIONS] : "Generating...");

  const handleGenerate = useCallback(async () => {
    logger.info('Starting Blueprint Generation', { length: prompt.length });

    const tasks = [
      async () => {
        logger.info('Triggering Executive Summary agent');
        return executiveSummary.complete(prompt, { body: { section: 'executiveSummary', imageAnalysis: pastedImage } });
      },
      async () => {
        logger.info('Triggering Architecture agent');
        return architecture.complete(prompt, { body: { section: 'architecture', imageAnalysis: pastedImage } });
      },
      async () => {
        logger.info('Triggering Features agent');
        return features.complete(prompt, { body: { section: 'features', imageAnalysis: pastedImage } });
      },
      async () => {
        logger.info('Triggering Roadmap agent');
        return roadmap.complete(prompt, { body: { section: 'roadmap', imageAnalysis: pastedImage } });
      }
    ];

    try {
      await staggeredExecution(tasks, 500);
      logger.info('All agents successfully streamed');
    } catch (error) {
      logger.error('Agent generation pipeline failed', error);
    }
  }, [prompt, pastedImage, executiveSummary, architecture, features, roadmap]);

  const handleTabSwitch = useCallback(
    (key: TabKey) => {
      setActiveTab(key);
    },
    []
  );

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
  }, []);

  // Typewriter automatically restarts when text changes

  return (
    <section id="blueprint" className="py-32 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <Badge variant="glow" className="mb-4">
            Live Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See Blueprint OS in Action
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Enter a prompt and watch JINI transform it into a comprehensive
            execution blueprint in seconds.
          </p>
        </AnimatedSection>

        {/* Split layout */}
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ─── Left: Input Prompt (2 cols) ─── */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6 h-full" hover={false} id="blueprint-input-card">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-zinc-500 font-medium tracking-wide uppercase">
                    Input Prompt
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/60" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <span className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                </div>

                {/* Prompt display */}
                <div 
                  className={`bg-black/40 rounded-xl p-4 border transition-all font-mono text-sm leading-relaxed min-h-[180px] relative ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/[0.06]'} ${pastedImage || isStaging ? 'pb-24' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onPaste={handlePaste}
                    disabled={isGenerating}
                    placeholder="Describe your idea or paste an image here..."
                    className="w-full h-full bg-transparent text-zinc-300 resize-none outline-none min-h-[150px]"
                    spellCheck={false}
                  />
                  {isStaging && (
                    <div className="absolute bottom-4 left-4 flex items-center bg-black/60 rounded-lg border border-indigo-500/30 p-2 text-xs text-indigo-300">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Optimizing & Staging...
                    </div>
                  )}
                  {!isStaging && pastedImage && (
                    <div className="absolute bottom-4 left-4 group">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-indigo-500/30 bg-black/50">
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
                  
                  <div className="absolute top-4 right-4 text-zinc-600 opacity-40 pointer-events-none flex flex-col items-end">
                    <UploadCloud className="w-5 h-5 mb-1" />
                  </div>
                </div>

                {/* Generate button */}
                <div className="mt-6">
                  <Button
                    id="blueprint-generate-btn"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                        Generating Blueprint…
                      </span>
                    ) : hasGenerated ? (
                      '✨ Regenerate Blueprint'
                    ) : (
                      '⚡ Generate Blueprint'
                    )}
                  </Button>
                </div>

                {/* Generation progress bar */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-2"
                    >
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, ease: 'easeInOut' }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                        Prompt DNA™ engine analyzing…
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </div>

            {/* ─── Right: Output (3 cols) ─── */}
            <div className="lg:col-span-3">
              <GlassCard className="p-6 h-full" hover={false} id="blueprint-output-card">
                {/* Tab bar */}
                <div className="flex flex-wrap gap-1 mb-6 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        id={`blueprint-tab-${tab.key}`}
                        onClick={() => handleTabSwitch(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-indigo-500/20 text-indigo-400 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Content area */}
                <div className="bg-black/30 rounded-xl p-5 border border-white/[0.06] min-h-[340px] max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">


                  {isGenerating && !getActiveCompletion() && (
                    <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                      {/* Animated loading orbs */}
                      <div className="flex items-center gap-3">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400"
                            animate={{
                              y: [-8, 8, -8],
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-zinc-500 text-sm">
                        AI agents are crafting your blueprint…
                      </p>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {(hasGenerated || !isGenerating || getActiveCompletion()) && (
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {renderMarkdown(currentContent)}
                        {/* Typing cursor at end */}
                        {isGenerating && (
                          <motion.span
                            className="inline-block w-1.5 h-4 bg-indigo-400 rounded-sm ml-0.5 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              repeatType: 'reverse',
                            }}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
