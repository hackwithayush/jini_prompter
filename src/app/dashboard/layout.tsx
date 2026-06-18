import { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { LayoutDashboard, FileCode, Users, Settings, Zap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[#08060f] flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#08060f]/50 p-6 flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Zap className="w-6 h-6 text-[#9b6dff]" />
          <span className="font-bold text-xl tracking-tight text-white">JINI</span>
        </Link>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Home
          </Link>
          <Link href="/dashboard/blueprints" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors">
            <FileCode className="w-4 h-4" />
            Blueprints
          </Link>
          <Link href="/dashboard/agents" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors">
            <Users className="w-4 h-4" />
            Agent Forge
          </Link>
        </nav>

        <div className="pt-6 border-t border-white/10 mt-auto">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <div className="mt-4 px-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9b6dff] to-[#e8b84b] flex items-center justify-center text-xs font-bold">
              {session.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="text-sm truncate">
              <p className="font-medium">{session.user?.name || "User"}</p>
              <p className="text-xs text-zinc-500 truncate">{session.user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
