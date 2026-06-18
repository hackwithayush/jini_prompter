"use client";

import { Copy, Download } from "lucide-react";
import { cloneAgent } from "./new/actions";
import { Agent } from "@prisma/client";

export function AgentActions({ agent }: { agent: Agent }) {
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(agent, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `${agent.name.replace(/\s+/g, '_')}_agent.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex gap-2 w-full mt-auto">
      <form action={cloneAgent.bind(null, agent.id)} className="flex-1">
        <button type="submit" className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
          <Copy className="w-4 h-4" />
          Clone
        </button>
      </form>
      <button onClick={handleExport} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}
