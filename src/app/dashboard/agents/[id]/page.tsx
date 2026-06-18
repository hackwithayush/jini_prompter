import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { MemoryManager } from "./MemoryManager";
import { BrainCircuit, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentDNAChart } from "../AgentDNAChart";
import { deleteAgent } from "./actions";

export default async function AgentDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const agent = await prisma.agent.findUnique({
    where: { id: params.id, userId: session.user.id },
    include: { memories: { orderBy: { createdAt: "desc" } } }
  });

  if (!agent) notFound();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/agents" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-[#9b6dff]" />
            {agent.name}
          </h1>
          <p className="text-zinc-400">Manage agent memory, settings, and instructions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <div>
               <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Identity</h3>
               <p className="text-sm text-zinc-400">{agent.description}</p>
            </div>
            {agent.dna && (
              <div>
                 <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">DNA Stats</h3>
                 <AgentDNAChart dna={JSON.parse(agent.dna)} />
              </div>
            )}
            <div className="pt-4 border-t border-white/10">
               <form action={deleteAgent.bind(null, agent.id)}>
                 <button type="submit" className="flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold rounded-lg transition-colors">
                   <Settings className="w-4 h-4" />
                   Delete Agent
                 </button>
               </form>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <MemoryManager agentId={agent.id} initialMemories={agent.memories} />
        </div>
      </div>
    </div>
  );
}
