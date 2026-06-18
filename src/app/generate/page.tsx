'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  Sparkles,
  FileText,
  Cpu,
  List,
  Map,
  Loader2,
  Crown,
  Package,
  MousePointerClick,
  Palette,
  Code2,
  Brain,
  Shield,
  Megaphone,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Lightbulb,
  Zap,
  LayoutDashboard,
  X,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { FeedbackWidget } from '@/components/ui/FeedbackWidget';
import { AGENT_DEFINITIONS } from '@/lib/constants';
import {
  SAMPLE_BLUEPRINT_SECTIONS,
} from '@/lib/mock-data';

// Icon Map — maps agent icon string names to actual components

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Crown,
  Package,
  MousePointerClick,
  Palette,
  Code2,
  Brain,
  Shield,
  Megaphone,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Lightbulb,
};

// Tab config

const TABS = [
  { id: 'summary', label: 'Executive Summary', icon: FileText },
  { id: 'architecture', label: 'Architecture', icon: Cpu },
  { id: 'features', label: 'Features', icon: List },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
] as const;

type TabId = (typeof TABS)[number]['id'];

const TAB_CONTENT: Record<TabId, string> = {
  summary: SAMPLE_BLUEPRINT_SECTIONS.executiveSummary,
  architecture: SAMPLE_BLUEPRINT_SECTIONS.architecture,
  features: SAMPLE_BLUEPRINT_SECTIONS.features,
  roadmap: SAMPLE_BLUEPRINT_SECTIONS.roadmap,
};

// Suggestion chips — sample prompts per category

const SUGGESTION_CHIPS = [
  {
    label: 'SaaS Platform',
    prompt:
      'Build a SaaS analytics platform that helps e-commerce businesses track customer behavior, predict churn, and automate email campaigns using AI.',
  },
  {
    label: 'Mobile App',
    prompt:
      'Create a mobile app for language learning that uses spaced repetition, AI-generated conversations, and speech recognition for pronunciation feedback.',
  },
  {
    label: 'AI Agent',
    prompt:
      'Design an AI agent system that monitors code repositories, automatically reviews pull requests, suggests improvements, and generates documentation.',
  },
  {
    label: 'E-commerce',
    prompt:
      'Build a headless e-commerce platform with AI-powered product recommendations, dynamic pricing, and automated inventory management.',
  },
  {
    label: 'Marketplace',
    prompt:
      'Create a freelancer marketplace focused on AI/ML talent with skill verification, automated project matching, and escrow payments.',
  },
  {
    label: 'Developer Tool',
    prompt:
      'Build a developer productivity tool that integrates with VS Code, provides AI-powered code generation, debugging assistance, and performance profiling.',
  },
];

// Simple markdown-like renderer

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // H1
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={i} className="text-2xl font-bold text-white mt-2">
              <GradientText>{trimmed.slice(2)}</GradientText>
            </h1>
          );
        }
        // H2
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={i} className="text-lg font-semibold text-white mt-6 mb-2">
              {trimmed.slice(3)}
            </h2>
          );
        }
        // H3
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={i}
              className="text-base font-semibold text-indigo-300 mt-4 mb-1"
            >
              {trimmed.slice(4)}
            </h3>
          );
        }
        // List items with bold
        if (trimmed.startsWith('- **') || trimmed.match(/^\d+\.\s\*\*/)) {
          const match = trimmed.match(/^[-\d.]+\s*\*\*(.+?)\*\*\s*[—–-]?\s*(.*)/);
          if (match) {
            return (
              <div key={i} className="flex items-start gap-2 pl-4">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500/60 shrink-0" />
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-white">{match[1]}</span>
                  {match[2] && (
                    <span className="text-zinc-400"> — {match[2]}</span>
                  )}
                </p>
              </div>
            );
          }
        }
        // Regular list item
        if (trimmed.startsWith('- ')) {
          return (
            <div key={i} className="flex items-start gap-2 pl-4">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500/60 shrink-0" />
              <p className="text-sm text-zinc-400 leading-relaxed">
                {trimmed.slice(2)}
              </p>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={i} className="text-sm text-zinc-400 leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

// MAIN PAGE COMPONENT

export default function GeneratePage() {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const handleGenerate = useCallback(() => {
    if (!inputText.trim() || isGenerating) return;

    setIsGenerating(true);
    setIsCompleted(false);
    setActiveAgents([]);
    setCompletedAgents([]);
    setActiveTab('summary');

    // Clear any previous timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    // Stagger agent activation
    AGENT_DEFINITIONS.forEach((agent, index) => {
      // Activate agent
      const activateTimeout = setTimeout(() => {
        setActiveAgents((prev) => [...prev, agent.id]);
      }, 200 + index * 250);
      timeoutRefs.current.push(activateTimeout);

      // Complete agent
      const completeTimeout = setTimeout(() => {
        setCompletedAgents((prev) => [...prev, agent.id]);
      }, 800 + index * 250);
      timeoutRefs.current.push(completeTimeout);
    });

    // Finish generation
    const finishTimeout = setTimeout(() => {
      setIsGenerating(false);
      setIsCompleted(true);
    }, 800 + AGENT_DEFINITIONS.length * 250 + 400);
    timeoutRefs.current.push(finishTimeout);
  }, [inputText, isGenerating]);

  const handleChipClick = useCallback((prompt: string) => {
    setInputText(prompt);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setPastedImage(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
          e.preventDefault(); // Prevent default text pasting behavior if image
        }
        break; // Process only the first image
      }
    }
  }, []);

  const removeImage = useCallback(() => {
    setPastedImage(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* ─── Top Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative flex items-center justify-center w-8 h-8">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
              <Sparkles className="relative w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
            </span>
            <span className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                JINI
              </span>
              <span className="text-zinc-500 font-normal">.ai</span>
            </span>
          </Link>

          <Link
            href="/"
            id="generate-back-home"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="flex flex-col lg:flex-row gap-6 p-6 pt-24 max-w-[1600px] mx-auto min-h-screen">
        {/* ═══════════════════════════════════════════════════════════════
            LEFT PANEL — Idea Input
        ═══════════════════════════════════════════════════════════════ */}
        <div className="lg:w-[420px] shrink-0 space-y-5">
          <GlassCard glow hover={false} className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Your Idea</h2>
                <p className="text-xs text-zinc-500">
                  Describe what you want to build
                </p>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                id="generate-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPaste={handlePaste}
                placeholder="Describe your idea in detail... (You can also paste images here)"
                className={`w-full min-h-[200px] bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 ${pastedImage ? 'pb-24' : ''} text-white text-sm placeholder-zinc-600 resize-none focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 leading-relaxed`}
              />
              
              {pastedImage && (
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
            </div>

            {/* Suggestion Chips */}
            <div className="mt-4 mb-5">
              <p className="text-xs text-zinc-600 mb-2.5 uppercase tracking-wider font-medium">
                Try a suggestion
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    id={`chip-${chip.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleChipClick(chip.prompt)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-indigo-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              id="generate-button"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleGenerate}
              disabled={!inputText.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Blueprint...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate Blueprint
                </>
              )}
            </Button>
          </GlassCard>

          {/* ─── Agent Status Panel (shown during/after generation) ─── */}
          <AnimatePresence>
            {(isGenerating || isCompleted) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassCard hover={false} className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Agent Forge™
                    </h3>
                    {isGenerating && (
                      <span className="ml-auto text-xs text-indigo-400 animate-pulse">
                        Processing…
                      </span>
                    )}
                    {isCompleted && (
                      <span className="ml-auto text-xs text-emerald-400">
                        ✓ Complete
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {AGENT_DEFINITIONS.map((agent, index) => {
                      const Icon =
                        ICON_MAP[agent.icon] || Sparkles;
                      const isActive = activeAgents.includes(agent.id);
                      const isDone = completedAgents.includes(agent.id);

                      return (
                        <motion.div
                          key={agent.id}
                          id={`agent-status-${agent.id}`}
                          className="flex flex-col items-center gap-1.5"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: isActive ? 1 : 0.3,
                            scale: isActive ? 1 : 0.8,
                          }}
                          transition={{
                            duration: 0.35,
                            delay: index * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          {/* Agent circle */}
                          <div className="relative">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                                isDone
                                  ? 'border-emerald-500/30 bg-emerald-500/10'
                                  : isActive
                                  ? 'border-indigo-500/40 bg-indigo-500/15'
                                  : 'border-white/[0.06] bg-white/[0.03]'
                              }`}
                            >
                              <Icon
                                className={`w-4 h-4 transition-colors duration-300 ${
                                  isDone
                                    ? 'text-emerald-400'
                                    : isActive
                                    ? 'text-indigo-400'
                                    : 'text-zinc-600'
                                }`}
                              />
                            </div>

                            {/* Pulsing indicator */}
                            {isActive && !isDone && (
                              <motion.span
                                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-indigo-400"
                                animate={{
                                  scale: [1, 1.4, 1],
                                  opacity: [1, 0.5, 1],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              />
                            )}
                            {isDone && (
                              <motion.span
                                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 400,
                                  damping: 15,
                                }}
                              />
                            )}
                          </div>

                          {/* Agent name */}
                          <span
                            className={`text-[10px] text-center leading-tight transition-colors duration-300 ${
                              isDone
                                ? 'text-emerald-400/80'
                                : isActive
                                ? 'text-zinc-400'
                                : 'text-zinc-700'
                            }`}
                          >
                            {agent.name.replace(' Agent', '')}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: '0%' }}
                      animate={{
                        width: isCompleted
                          ? '100%'
                          : `${
                              (completedAgents.length /
                                AGENT_DEFINITIONS.length) *
                              100
                            }%`,
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            RIGHT PANEL — Blueprint Output
        ═══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* ── Empty State ── */}
            {!isGenerating && !isCompleted && (
              <motion.div
                key="empty"
                className="flex flex-col items-center justify-center h-full min-h-[500px] lg:min-h-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                  <div className="relative w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                    <LayoutDashboard className="w-10 h-10 text-zinc-700" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-zinc-500 mb-2">
                  No Blueprint Yet
                </h3>
                <p className="text-sm text-zinc-600 text-center max-w-md leading-relaxed">
                  Enter your idea on the left and click{' '}
                  <span className="text-indigo-400/70">Generate Blueprint</span>{' '}
                  to watch our 12 AI agents build your complete project
                  architecture.
                </p>
              </motion.div>
            )}

            {/* ── Generating State ── */}
            {isGenerating && (
              <motion.div
                key="generating"
                className="flex flex-col items-center justify-center h-full min-h-[500px] lg:min-h-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                {/* Animated orb */}
                <div className="relative mb-8">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div
                    className="relative w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Brain className="w-12 h-12 text-indigo-400" />
                  </motion.div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  <GradientText animate>
                    Generating Blueprint...
                  </GradientText>
                </h3>
                <p className="text-sm text-zinc-500 text-center max-w-md">
                  12 AI agents are analyzing your idea, building architecture,
                  and crafting your execution plan.
                </p>

                {/* Live agent activity feed */}
                <motion.div
                  className="mt-8 w-full max-w-md space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {AGENT_DEFINITIONS.filter((a) =>
                    activeAgents.includes(a.id)
                  )
                    .slice(-3)
                    .map((agent) => {
                      const Icon = ICON_MAP[agent.icon] || Sparkles;
                      const isDone = completedAgents.includes(agent.id);
                      return (
                        <motion.div
                          key={agent.id}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon
                            className="w-4 h-4 shrink-0"
                            />
                          <span className="text-sm text-zinc-300 flex-1">
                            {agent.name}
                          </span>
                          <span className="text-xs text-zinc-600">
                            {agent.role}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                          )}
                        </motion.div>
                      );
                    })}
                </motion.div>
              </motion.div>
            )}

            {/* ── Completed State — Tabbed Blueprint ── */}
            {isCompleted && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassCard glow hover={false} className="overflow-hidden">
                  {/* Tab Bar */}
                  <div className="flex items-center border-b border-white/[0.06] overflow-x-auto">
                    {TABS.map((tab) => {
                      const TabIcon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          id={`tab-${tab.id}`}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                            isActive
                              ? 'text-indigo-400'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">{tab.label}</span>

                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 to-purple-500"
                              layoutId="activeTab"
                              transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <div className="p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <MarkdownContent content={TAB_CONTENT[activeTab]} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </GlassCard>

                {/* Blueprint meta bar */}
                <motion.div
                  className="mt-4 flex flex-wrap items-center gap-4 px-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <Sparkles className="w-3 h-3 text-indigo-500/50" />
                    Generated by 12 AI Agents
                  </div>
                  <div className="h-3 w-px bg-white/[0.06]" />
                  <div className="text-xs text-zinc-600">
                    Processing time: 2.8s
                  </div>
                  <div className="h-3 w-px bg-white/[0.06]" />
                  <div className="text-xs text-zinc-600">
                    Quality Score: 98/100
                  </div>
                  <div className="h-3 w-px bg-white/[0.06]" />
                  <FeedbackWidget blueprintId={null} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
