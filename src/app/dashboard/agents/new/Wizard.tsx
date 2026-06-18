"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { createAgent } from "./actions";
import { ChevronRight, ChevronLeft, Save, Bot, BrainCircuit, Wrench, Target } from "lucide-react";

export function Wizard({ userId }: { userId: string }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Custom",
    systemPrompt: "",
    personality: "",
    tools: ["Web Search"],
    primaryGoal: "",
    successCriteria: "",
    dna: { Creativity: 50, Reasoning: 50, Business: 50, Technical: 50, Research: 50, Communication: 50 }
  });

  const updateForm = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateDNA = (key: string, value: number) => {
    setFormData(prev => ({ ...prev, dna: { ...prev.dna, [key]: value } }));
  };

  const steps = [
    { id: 1, title: "Identity", icon: Bot },
    { id: 2, title: "Brain", icon: BrainCircuit },
    { id: 3, title: "Tools & Goals", icon: Target },
    { id: 4, title: "Agent DNA", icon: Wrench },
  ];

  return (
    <GlassCard className="p-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isPassed = step > s.id;
          return (
            <div key={s.id} className="flex items-center">
              <div className={`flex flex-col items-center gap-2 ${isActive ? "text-[#e8b84b]" : isPassed ? "text-white" : "text-zinc-600"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? "border-[#e8b84b] bg-[#e8b84b]/10" : isPassed ? "border-white bg-white/5" : "border-zinc-700 bg-transparent"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{s.title}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 h-px mx-4 ${isPassed ? "bg-white/50" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </div>

      <form action={createAgent} className="space-y-6">
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="name" value={formData.name} />
        <input type="hidden" name="description" value={formData.description} />
        <input type="hidden" name="category" value={formData.category} />
        <input type="hidden" name="systemPrompt" value={formData.systemPrompt} />
        <input type="hidden" name="personality" value={formData.personality} />
        <input type="hidden" name="tools" value={JSON.stringify(formData.tools)} />
        <input type="hidden" name="goals" value={JSON.stringify({ primaryGoal: formData.primaryGoal, successCriteria: formData.successCriteria })} />
        <input type="hidden" name="dna" value={JSON.stringify(formData.dna)} />

        {/* STEP 1: IDENTITY */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Agent Name <span className="text-red-400">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. Marketing Guru"
                value={formData.name}
                onChange={e => updateForm("name", e.target.value)}
                className="w-full bg-[#08060f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9b6dff] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
              <textarea 
                placeholder="Briefly describe what this agent does..."
                value={formData.description}
                onChange={e => updateForm("description", e.target.value)}
                className="w-full bg-[#08060f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9b6dff] transition-colors h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Category</label>
              <input 
                type="text" 
                placeholder="e.g. Business, Marketing, Development"
                value={formData.category}
                onChange={e => updateForm("category", e.target.value)}
                className="w-full bg-[#08060f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9b6dff] transition-colors"
              />
            </div>
          </div>
        )}

        {/* STEP 2: BRAIN */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">System Prompt <span className="text-red-400">*</span></label>
              <p className="text-xs text-zinc-500 mb-2">The core instructions that define how this agent behaves.</p>
              <textarea 
                placeholder="You are an expert... Your role is to..."
                value={formData.systemPrompt}
                onChange={e => updateForm("systemPrompt", e.target.value)}
                className="w-full bg-[#08060f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9b6dff] transition-colors h-48 resize-none font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Personality</label>
              <input 
                type="text" 
                placeholder="e.g. Analytical, enthusiastic, concise..."
                value={formData.personality}
                onChange={e => updateForm("personality", e.target.value)}
                className="w-full bg-[#08060f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9b6dff] transition-colors"
              />
            </div>
          </div>
        )}

        {/* STEP 3: TOOLS & GOALS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Primary Goal</label>
              <input 
                type="text" 
                placeholder="What is the ultimate objective?"
                value={formData.primaryGoal}
                onChange={e => updateForm("primaryGoal", e.target.value)}
                className="w-full bg-[#08060f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9b6dff] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Success Criteria</label>
              <textarea 
                placeholder="How do we know the goal is met?"
                value={formData.successCriteria}
                onChange={e => updateForm("successCriteria", e.target.value)}
                className="w-full bg-[#08060f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9b6dff] transition-colors h-24 resize-none"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-zinc-300 mb-2">Available Capabilities (Future Phase)</label>
               <div className="flex gap-2 flex-wrap">
                  {["Web Search", "Blueprint Analyzer", "Prompt Optimizer", "Code Generator"].map(tool => (
                     <div key={tool} className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${formData.tools.includes(tool) ? "border-[#9b6dff] bg-[#9b6dff]/20 text-[#c4b5fd]" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
                          onClick={() => {
                             if (formData.tools.includes(tool)) updateForm("tools", formData.tools.filter(t => t !== tool));
                             else updateForm("tools", [...formData.tools, tool]);
                          }}>
                        {tool}
                     </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* STEP 4: AGENT DNA */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <p className="text-sm text-zinc-400 mb-4">Set the core stats for this agent. This affects how it processes and generates output.</p>
             
             {Object.keys(formData.dna).map(trait => (
               <div key={trait}>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-zinc-300 font-medium">{trait}</span>
                   <span className="text-[#e8b84b] font-bold">{formData.dna[trait as keyof typeof formData.dna]}</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" 
                   max="100" 
                   value={formData.dna[trait as keyof typeof formData.dna]}
                   onChange={e => updateDNA(trait, parseInt(e.target.value))}
                   className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#9b6dff]"
                 />
               </div>
             ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 mt-8 border-t border-white/10">
          <button 
            type="button"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${step === 1 ? "opacity-0 pointer-events-none" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          
          {step < 4 ? (
            <button 
              type="button"
              disabled={(step === 1 && !formData.name.trim()) || (step === 2 && !formData.systemPrompt.trim())}
              onClick={() => setStep(s => Math.min(4, s + 1))}
              className={`flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors ${((step === 1 && !formData.name.trim()) || (step === 2 && !formData.systemPrompt.trim())) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#9b6dff] to-[#e8b84b] text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#9b6dff]/20"
            >
              <Save className="w-4 h-4" />
              Forge Agent
            </button>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
