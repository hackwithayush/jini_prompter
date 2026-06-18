'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { FileCode, Layers, Sparkles, CheckCircle2, RefreshCw, Workflow, Wrench } from 'lucide-react';
import { useBlueprint } from '@/lib/context/BlueprintContext';

const STEPS = [
  { id: 'generate', label: '01 Generate' },
  { id: 'score', label: '02 Score & Critique' },
  { id: 'refine', label: '03 Refine' },
  { id: 'perfect', label: '✦ Perfect Blueprint' },
];

const TABS = [
  { id: 'prompt', label: 'Master Prompt', icon: FileCode },
  { id: 'blueprint', label: 'Blueprint', icon: Layers },
  { id: 'execution', label: 'Execution Plan', icon: CheckCircle2 },
  { id: 'tools', label: 'Recommended Tools', icon: Wrench },
  { id: 'workflow', label: 'Agent Workflow', icon: Workflow },
];

export function GeneratedOutput() {
  const { blueprint, isLoading, error } = useBlueprint();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('prompt');
  const [elapsedTime, setElapsedTime] = useState(0);

  let wordCount = 0;
  if (blueprint) {
    const allText = [
      blueprint.masterPrompt,
      blueprint.executiveSummary,
      blueprint.architecture,
      blueprint.executionPlan,
      blueprint.recommendedTools,
      blueprint.agentWorkflow
    ].filter(Boolean).join(' ');
    wordCount = allText.trim().split(/\s+/).filter(w => w.length > 0).length;
  }

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setTimeout(() => setElapsedTime(0), 0);
      const startTime = Date.now();
      timer = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);



  // Control Refine Loop based on isLoading
  useEffect(() => {
    if (isLoading) {
      // Loop through steps 0 to 2 while loading
      const interval = setInterval(() => {
        setActiveStep(prev => prev < 2 ? prev + 1 : 0);
      }, 2000);
      return () => clearInterval(interval);
    } else if (blueprint && !isLoading) {
      // Set to final step when done
      setTimeout(() => setActiveStep(3), 0);
    } else {
      setTimeout(() => setActiveStep(0), 0);
    }
  }, [isLoading, blueprint]);

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="gold" className="mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Live Refine Loop
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            The Magic Behind the Curtain
          </h2>
          <p className="text-lg text-[#c4b5fd] max-w-2xl mx-auto">
            Watch as our AI agents generate, critique, and refine your idea into a production-ready reality.
          </p>
        </AnimatedSection>

        {/* Refine Loop Tracker */}
        <AnimatedSection delay={0.2} className="mb-12">
          <div className="flex flex-wrap items-center justify-between max-w-4xl mx-auto gap-4">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1 min-w-[120px]">
                <div className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-500 whitespace-nowrap ${
                  idx === activeStep 
                    ? 'bg-[#9d4edd]/20 border-[#9d4edd] text-white shadow-[0_0_15px_rgba(157,78,221,0.5)]'
                    : idx < activeStep
                    ? 'bg-white/5 border-white/10 text-zinc-400'
                    : 'bg-transparent border-transparent text-zinc-600'
                }`}>
                  {idx === activeStep && idx < STEPS.length - 1 && <RefreshCw className="w-4 h-4 inline-block mr-2 animate-spin text-[#eab308]" />}
                  {step.label}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-2 transition-all duration-500 ${idx < activeStep ? 'bg-[#9d4edd]/50' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Generated Output UI */}
        <AnimatedSection delay={0.4}>
          <GlassCard glow className="border-[#9d4edd]/30">
            <div className="flex flex-col lg:flex-row border-b border-white/10">
              {/* Output Tabs */}
              <div className="flex-1 flex overflow-x-auto scrollbar-hide border-r border-white/10">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#9d4edd] text-white bg-[#9d4edd]/10'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* Output Stats */}
              <div className="flex items-center gap-6 px-6 py-4 bg-black/20">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500">Quality</span>
                  <span className="text-[#eab308] font-bold">{blueprint?.qualityScore ? blueprint.qualityScore : (isLoading ? '...' : '0.0')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500">Time</span>
                  <span className="text-white font-medium">{elapsedTime.toFixed(1)}s</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500">Generated</span>
                  <span className="text-white font-medium">{wordCount}w</span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 bg-[#09090b]/80 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-mono text-sm leading-relaxed text-zinc-300"
                >
                  {error ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-red-400">
                      <Wrench className="w-8 h-8 mb-4 text-red-500" />
                      <p className="font-bold text-lg mb-2">Generation Failed</p>
                      <p className="max-w-md text-center text-sm text-red-300">
                        {error.message || "An unexpected error occurred during generation."}
                      </p>
                      <p className="mt-4 text-xs text-zinc-500 max-w-md text-center">
                        Note: JINI defaults to using local AI models via Ollama. Make sure Ollama is running at localhost:11434 and the required models are pulled.
                      </p>
                    </div>
                  ) : activeStep < STEPS.length - 1 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-zinc-500">
                      <RefreshCw className="w-8 h-8 animate-spin mb-4 text-[#9d4edd]" />
                      <p>Agents are currently refining the {TABS.find(t => t.id === activeTab)?.label}...</p>
                      <p className="mt-2 text-xs text-[#c4b5fd]">Iteration {activeStep + 1} of {STEPS.length - 1}</p>
                    </div>
                  ) : (
                      <div className="space-y-4 whitespace-pre-wrap">
                        {/* Real Streamed Content */}
                        <h3 className="text-xl font-bold text-white font-serif mb-4 flex items-center gap-2">
                          <Sparkles className="text-[#eab308] w-5 h-5" />
                          Final {TABS.find(t => t.id === activeTab)?.label}
                        </h3>
                        
                        {activeTab === 'prompt' && (
                          <div className="text-zinc-300">
                            {blueprint?.masterPrompt || "Awaiting master prompt generation..."}
                          </div>
                        )}

                        {activeTab === 'blueprint' && (
                          <div className="text-zinc-300">
                            <h4 className="text-[#eab308] font-bold mb-2">Executive Summary</h4>
                            <p className="mb-4">{blueprint?.executiveSummary || "Analyzing architecture..."}</p>
                            <h4 className="text-[#eab308] font-bold mb-2">Architecture</h4>
                            <p>{blueprint?.architecture || "Structuring the core systems..."}</p>
                          </div>
                        )}

                        {activeTab === 'execution' && (
                          <div className="text-zinc-300">
                            {blueprint?.executionPlan || "Drafting the execution plan..."}
                          </div>
                        )}

                        {activeTab === 'tools' && (
                          <div className="text-zinc-300">
                            {blueprint?.recommendedTools || "Selecting the optimal tech stack..."}
                          </div>
                        )}

                        {activeTab === 'workflow' && (
                          <div className="text-zinc-300">
                            {blueprint?.agentWorkflow || "Mapping out agent responsibilities..."}
                          </div>
                        )}

                        {blueprint?.qualityScore && (
                          <div className="mt-8 p-4 rounded-lg bg-[#9d4edd]/10 border border-[#9d4edd]/30 text-[#eab308]">
                            ✦ Ready for production deployment. Blueprint Quality Score: {blueprint.qualityScore}/10.
                          </div>
                        )}
                      </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
}
