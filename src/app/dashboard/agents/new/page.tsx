import { auth } from "@/auth";
import { Wizard } from "./Wizard";
import { Users } from "lucide-react";

export default async function NewAgentPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-[#e8b84b]" />
          Forge New Agent
        </h1>
        <p className="text-zinc-400">Design a specialized AI worker with custom instructions, personality, and tools.</p>
      </div>

      <Wizard userId={session.user.id} />
    </div>
  );
}
