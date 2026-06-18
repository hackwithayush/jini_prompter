import { signIn } from "@/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { Key, Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#08060f] flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#9b6dff]/10 blur-3xl -z-10" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9b6dff]/20 to-[#e8b84b]/20 flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_30px_rgba(155,109,255,0.2)]">
            <Zap className="w-8 h-8 text-[#e8b84b]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Sign in to JINI</h1>
          <p className="text-zinc-400 text-center text-sm">
            Access your Agent Forge, Blueprints, and master prompt DNA.
          </p>
        </div>

        <div className="space-y-3">
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
            >
              <Key className="w-5 h-5" />
              Continue with GitHub
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </GlassCard>
    </div>
  );
}
