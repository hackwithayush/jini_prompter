import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Plus, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { AgentDNAChart } from "./AgentDNAChart";
import { AgentActions } from "./AgentActions";
import { ImportAgentButton } from "./ImportAgentButton";

export default async function AgentsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Fetch user agents and public templates
  const [myAgents, templates] = await Promise.all([
    prisma.agent.findMany({
      where: { userId: session.user.id, isTemplate: false },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.agent.findMany({
      where: { isTemplate: true, isPublic: true },
      orderBy: { name: 'asc' },
    })
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#e8b84b]" />
            Agent Forge™
          </h1>
          <p className="text-zinc-400">Build, train, and manage your specialized AI workforce.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <ImportAgentButton />
          <Link 
            href="/dashboard/agents/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#9b6dff] to-[#e8b84b] rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#9b6dff]/20"
          >
            <Plus className="w-4 h-4" />
            Forge New Agent
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
          <BrainCircuit className="w-5 h-5 text-[#9b6dff]" />
          My Active Agents
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {myAgents.length === 0 ? (
            <div className="col-span-2 p-12 text-center border border-white/10 rounded-xl bg-white/5">
              <p className="text-zinc-400">You haven&apos;t forged any agents yet. Start with a template or build from scratch.</p>
            </div>
          ) : (
            myAgents.map(agent => (
              <GlassCard key={agent.id} className="p-6 flex flex-col hover:border-[#e8b84b]/50 transition-colors cursor-pointer relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8b84b]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#e8b84b]/10 transition-colors" />
                
                <div className="flex justify-between items-start mb-4 relative">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                    <p className="text-sm text-zinc-400">{agent.category || "Custom Agent"}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-[#9b6dff]/20 text-[#c4b5fd] rounded">
                    v{agent.version}
                  </span>
                </div>
                
                <p className="text-sm text-zinc-300 line-clamp-2 mb-6 flex-1 relative">
                  {agent.description || agent.systemPrompt}
                </p>

                {agent.dna && (
                  <div className="mb-6 relative">
                     <AgentDNAChart dna={JSON.parse(agent.dna)} />
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto relative mb-4">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    Memory Enabled
                  </div>
                  <Link href={`/dashboard/agents/${agent.id}`} className="text-sm text-white hover:text-[#e8b84b] font-medium transition-colors">
                    Manage &rarr;
                  </Link>
                </div>
                
                <AgentActions agent={agent} />
              </GlassCard>
            ))
          )}
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
          <Sparkles className="w-5 h-5 text-[#e8b84b]" />
          JINI Templates
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(agent => (
            <GlassCard key={agent.id} className="p-5 hover:border-white/20 transition-colors cursor-pointer flex flex-col group">
               <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#9b6dff] transition-colors">{agent.name}</h3>
               </div>
               <p className="text-xs text-[#e8b84b] mb-3">{agent.category}</p>
               <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
                  {agent.description}
               </p>
               {agent.dna && (
                  <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity relative">
                     <AgentDNAChart dna={JSON.parse(agent.dna)} compact />
                  </div>
                )}
               <AgentActions agent={agent} />
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
