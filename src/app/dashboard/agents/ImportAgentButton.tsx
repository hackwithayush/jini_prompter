"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";
import { importAgent } from "./new/actions";

export function ImportAgentButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        await importAgent(json);
        alert("Agent imported successfully!");
      } catch (err) {
        console.error("Failed to import agent", err);
        alert("Failed to import agent. Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset input
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".json" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#18181b] border border-[#e8b84b]/20 hover:border-[#e8b84b]/50 rounded-lg text-sm font-bold text-white transition-colors"
      >
        <Upload className="w-4 h-4 text-[#e8b84b]" />
        Import JSON
      </button>
    </div>
  );
}
