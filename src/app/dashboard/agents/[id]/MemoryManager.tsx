"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Database, Plus, Trash2 } from "lucide-react";
import { addMemory, deleteMemory } from "./actions";
import { AgentMemory } from "@prisma/client";

export function MemoryManager({ agentId, initialMemories }: { agentId: string, initialMemories: AgentMemory[] }) {
  return (
    <GlassCard className="p-8">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-[#e8b84b]" />
            Agent Memory v1
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Facts, Preferences, and Project Context stored permanently.</p>
        </div>
      </div>

      <form action={addMemory.bind(null, agentId)} className="flex gap-4 mb-8">
        <select name="category" className="bg-[#08060f] border border-white/10 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-[#9b6dff]">
          <option value="Fact">Fact</option>
          <option value="Preference">Preference</option>
          <option value="Project">Project</option>
          <option value="Note">Note</option>
        </select>
        <input 
          required
          name="key"
          type="text" 
          placeholder="Key (e.g. Code Style)" 
          className="flex-1 bg-[#08060f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9b6dff] text-sm"
        />
        <input 
          required
          name="value"
          type="text" 
          placeholder="Value (e.g. Use functional components)" 
          className="flex-[2] bg-[#08060f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#9b6dff] text-sm"
        />
        <button type="submit" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="space-y-3">
        {initialMemories.length === 0 ? (
          <div className="p-8 text-center border border-white/10 rounded-xl border-dashed">
            <p className="text-zinc-500 text-sm">Memory bank is empty. Teach your agent something new.</p>
          </div>
        ) : (
          initialMemories.map(mem => (
            <div key={mem.id} className="flex items-center gap-4 p-4 bg-[#08060f] border border-white/10 rounded-xl group">
              <span className="text-[10px] uppercase font-bold text-[#e8b84b] bg-[#e8b84b]/10 px-2 py-1 rounded w-20 text-center">
                {mem.category || "Fact"}
              </span>
              <div className="flex-1 text-sm">
                <span className="font-bold text-white mr-2">{mem.key}:</span>
                <span className="text-zinc-400">{mem.value}</span>
              </div>
              <button 
                onClick={() => deleteMemory(mem.id, agentId)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
