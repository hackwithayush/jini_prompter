import { generateObject, streamObject } from 'ai';
import { z } from 'zod';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openRouter = createOpenRouter({
  apiKey: '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',
});

const OrchestratorModel = openRouter('openai/gpt-4o-mini');

async function main() {
  try {
    console.log("Testing streamObject...");
    
    const blueprintSchema = z.object({
      title: z.string().describe("A catchy, short title for this project."),
      masterPrompt: z.string().describe("The perfected master prompt. MUST be highly detailed, scalable, goal-focused, and technically robust."),
      executiveSummary: z.string().describe("A high-level summary of the generated blueprint."),
      architecture: z.string().describe("The core architecture, tech stack, and structural outline."),
      agentWorkflow: z.string().describe("Detailed description of the core features and AI agent workflows."),
      executionPlan: z.string().describe("A step-by-step roadmap and execution plan."),
      recommendedTools: z.string().describe("Recommended tools, software, databases, and packages for building the project."),
      qualityScore: z.union([z.number(), z.string()]).describe("A score out of 10. Can be a number like 9.5 or a string like '9.5/10'."),
      clarityScore: z.number().describe("Score 0-100 indicating how clear and precise the user's prompt was."),
      structureScore: z.number().describe("Score 0-100 indicating the structural organization of the prompt."),
      reasoningScore: z.number().describe("Score 0-100 indicating the depth of reasoning required."),
      optimizationScore: z.number().describe("Score 0-100 indicating how well the prompt is optimized for AI consumption."),
      conversionScore: z.number().describe("Score 0-100 indicating the business conversion or success potential."),
    });

    const result = await streamObject({
      model: OrchestratorModel,
      schema: blueprintSchema,
      system: "You are a planner",
      prompt: "Build me a CRM system",
      providerOptions: {
        openrouter: {
          max_tokens: 8000
        }
      }
    });
    
    for await (const partial of result.partialObjectStream) {
      process.stdout.write(".");
    }
    console.log("\nDone streamObject!");
    
  } catch (err: any) {
    console.error("\nError streamObject:", err);
    if (err.cause) console.error("Cause:", err.cause);
    if (err.data) console.error("Data:", err.data);
  }
}

main();
