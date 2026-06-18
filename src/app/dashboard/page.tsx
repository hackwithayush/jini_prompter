import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { FileCode, Users, Zap, Brain } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) return null;

  // Fetch stats from DB
  const [blueprintCount, agentCount, recentBlueprints] = await Promise.all([
    prisma.blueprint.count({ where: { project: { userId: session.user.id } } }),
    prisma.agent.count({ where: { userId: session.user.id } }),
    prisma.blueprint.findMany({
      where: { project: { userId: session.user.id } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {session.user.name?.split(' ')[0] || 'Creator'}</h1>
        <p className="text-zinc-400">Here&apos;s a high-level overview of your AI ecosystem.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#9b6dff]/20 flex items-center justify-center">
              <FileCode className="w-6 h-6 text-[#9b6dff]" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium">Total Blueprints</p>
              <h3 className="text-2xl font-bold text-white">{blueprintCount}</h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#e8b84b]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#e8b84b]" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium">Active Agents</p>
              <h3 className="text-2xl font-bold text-white">{agentCount}</h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium">Avg Quality Score</p>
              <h3 className="text-2xl font-bold text-white">
                {recentBlueprints.length > 0 
                  ? (recentBlueprints.reduce((acc, curr) => acc + (curr.qualityScore || 0), 0) / recentBlueprints.length).toFixed(1) 
                  : "N/A"}
              </h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium">Memory Nodes</p>
              <h3 className="text-2xl font-bold text-white">0</h3>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Generations</h2>
        <div className="space-y-4">
          {recentBlueprints.length === 0 ? (
            <div className="p-8 text-center border border-white/10 rounded-xl bg-white/5">
              <p className="text-zinc-400">No blueprints generated yet. Go to the home page to grant a wish!</p>
            </div>
          ) : (
            recentBlueprints.map(bp => (
              <GlassCard key={bp.id} className="p-4 flex items-center justify-between hover:border-[#9b6dff]/50 transition-colors cursor-pointer">
                <div>
                  <h4 className="text-white font-medium">{bp.title}</h4>
                  <p className="text-zinc-400 text-sm truncate max-w-xl">{bp.rawWish}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-500">
                    {new Date(bp.createdAt).toLocaleDateString()}
                  </span>
                  <div className="text-[#e8b84b] text-sm font-bold">
                    Score: {bp.qualityScore}/10
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
