'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';

// The schema matching the API
const blueprintSchema = z.object({
  title: z.string(),
  masterPrompt: z.string(),
  executiveSummary: z.string(),
  architecture: z.string(),
  agentWorkflow: z.string(),
  executionPlan: z.string(),
  recommendedTools: z.string(),
  qualityScore: z.union([z.number(), z.string()]),
  clarityScore: z.number(),
  structureScore: z.number(),
  reasoningScore: z.number(),
  optimizationScore: z.number(),
  conversionScore: z.number(),
});

type BlueprintType = z.infer<typeof blueprintSchema>;

interface BlueprintContextType {
  wish: string;
  setWish: (wish: string) => void;
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
  pastedImage: string | null;
  setPastedImage: (image: string | null) => void;
  submitWish: () => void;
  blueprint: Partial<BlueprintType> | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

const BlueprintContext = createContext<BlueprintContextType | undefined>(undefined);

export function BlueprintProvider({ children }: { children: ReactNode }) {
  const [wish, setWish] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [pastedImage, setPastedImage] = useState<string | null>(null);

  const { object: blueprint, submit, isLoading, error } = useObject({
    api: '/api/generate',
    schema: blueprintSchema,
  });

  const submitWish = () => {
    if (!wish.trim()) return;
    submit({ prompt: wish, agentId: selectedAgentId, image: pastedImage });
    
    // Automatically scroll down to the generation section
    setTimeout(() => {
      document.getElementById('generation-output')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  return (
    <BlueprintContext.Provider value={{ wish, setWish, selectedAgentId, setSelectedAgentId, pastedImage, setPastedImage, submitWish, blueprint, isLoading, error }}>
      {children}
    </BlueprintContext.Provider>
  );
}

export function useBlueprint() {
  const context = useContext(BlueprintContext);
  if (context === undefined) {
    throw new Error('useBlueprint must be used within a BlueprintProvider');
  }
  return context;
}
