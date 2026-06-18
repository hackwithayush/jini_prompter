import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { FileCode, Search, Filter } from "lucide-react";
import { FeedbackWidget } from "@/components/ui/FeedbackWidget";

export default async function BlueprintsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const blueprints = await prisma.blueprint.findMany({
    where: { project: { userId: session.user.id } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileCode className="w-8 h-8 text-[#9b6dff]" />
            Blueprint Library
          </h1>
          <p className="text-zinc-400">All your generated projects and architectures.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search blueprints..." 
              className="bg-[#08060f] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#9b6dff] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#08060f] border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {blueprints.length === 0 ? (
          <div className="col-span-2 p-12 text-center border border-white/10 rounded-xl bg-white/5">
            <p className="text-zinc-400">Your library is empty. Generate a blueprint from the home page!</p>
          </div>
        ) : (
          blueprints.map(bp => (
            <GlassCard key={bp.id} className="p-6 hover:border-[#9b6dff]/50 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-[#9b6dff] transition-colors">
                  {bp.title}
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded text-zinc-400">
                  {new Date(bp.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm text-zinc-400 line-clamp-2 mb-6">
                {bp.rawWish}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex gap-4 items-center">
                  <div className="text-xs">
                    <span className="text-zinc-500">Quality: </span>
                    <span className="text-[#e8b84b] font-bold">{bp.qualityScore}/10</span>
                  </div>
                  <div className="h-3 w-px bg-white/10" />
                  <FeedbackWidget blueprintId={bp.id} initialRating={bp.userRating} />
                </div>
                <button className="text-sm text-[#9b6dff] hover:text-white font-medium transition-colors">
                  View full blueprint &rarr;
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
