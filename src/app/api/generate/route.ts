import { streamObject } from 'ai';
import { z } from 'zod';
import { CeoModel, DeveloperModel, QaModel, DataModel, OrchestratorModel, VisionModel } from '@/lib/agents/models';
import { generateText, generateObject } from 'ai';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generateEmbedding, cosineSimilarity } from '@/lib/agents/embeddings';
import { readFileSync } from 'fs';
import { join } from 'path';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// The Blueprint Schema that the UI expects
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

const JINI_CORE_DIRECTIVE = `
# AGENT FORGE V2 CORE DIRECTIVE

You are operating at principal-level expertise.

Requirements:
- Think deeply before responding.
- Verify assumptions and identify risks.
- Challenge weak logic and produce implementation-ready outputs.
- Optimize for business value and massive system scalability.
- Never provide shallow recommendations.

CRITICAL MASTER PROMPT INSTRUCTIONS: 
When expanding the user's wish into the 'masterPrompt', you MUST strictly enforce extreme clarity, depth, and domain-specific rigor. You must adapt your output to fit your specific operational context:

FOR ENGINEERING & DATA DOMAINS:
1. Specific architectural frameworks to adopt (e.g., microservices, event-driven).
2. Precise technical stacks and databases tailored to the function.
3. Detailed scalability strategies (rate-limiting, high-concurrency handling, load balancing).
4. Clearly defined CI/CD pipelines, observability metrics, and infrastructure specifications (container management).

FOR BUSINESS, RESEARCH & CREATIVE DOMAINS:
1. Specific strategic frameworks and structural methodologies to adopt.
2. Precise tools, KPIs, and deliverables tailored to the function.
3. Detailed execution roadmaps, including risk mitigation and psychological/market hooks.
4. Clear formatting structures (e.g., hierarchies, strict citations, or style guides).

Deliver exceptional standards in a structured, integrated way, ensuring the directive is perfectly tuned to your current operational context.
`;

export async function POST(req: Request) {
  try {
    const { prompt: userWish, agentId, image } = await req.json();
    const session = await auth();

  // Step 0: Perform image analysis if an image was provided
  let imageAnalysis = "";
  if (image) {
    try {
      let imagePayload: Buffer | URL | string = image;
      
      // If it's a local staged URL, read it as a Buffer
      if (typeof image === 'string' && image.startsWith('/uploads/')) {
        const filePath = join(process.cwd(), 'public', image);
        imagePayload = readFileSync(filePath);
      } else if (typeof image === 'string' && image.startsWith('http')) {
        imagePayload = new URL(image);
      }

      const visionResponse = await generateText({
        model: VisionModel,
        providerOptions: { openrouter: { max_tokens: 2000 } },
        system: "You are the JINI Vision Agent. Your task is to analyze the user's uploaded image. Output a highly descriptive, technical explanation of what is in the image. Reconstruct the design style, colors, composition, and layout. Crucially, generate a highly detailed image creation prompt (e.g., for Midjourney, DALL-E, or Stable Diffusion) that could recreate this image perfectly. IMPORTANT GUARDRAIL: You must NEVER use trademarked character names, copyrighted IPs, or specific movie styles (e.g., NEVER use 'Spider-Man', 'Spider-Verse', 'Marvel', 'Disney'). Instead, you must sanitize the prompt: describe their visual appearance and the artistic aesthetic generically (e.g., 'agile masked superhero in a red and blue suit', 'stylized 3D animated comic book style with halftone patterns').",
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this image and describe it in detail. Reconstruct the layout, styling, and aesthetic. Provide a perfect image generation prompt at the end.' },
              {
                type: 'image',
                image: imagePayload,
              },
            ],
          },
        ],
      });
      imageAnalysis = visionResponse.text;
    } catch (err) {
      console.error("Failed to analyze image with VisionModel:", err);
      imageAnalysis = `[Note: An image was provided, but vision analysis failed: ${err instanceof Error ? err.message : err}]`;
    }
  }

  // Load custom agent if provided
  let agentContext = "";
  if (agentId) {
    const agent = await prisma.agent.findUnique({ 
      where: { id: agentId },
      include: { memories: true }
    });
    
    if (agent) {
      let memoryContext = "";
      
      // Perform Vector RAG if there are memories
      if (agent.memories.length > 0) {
        // Generate embedding for the user's current wish
        const wishVector = await generateEmbedding(userWish);
        
        if (wishVector.length > 0) {
          // Rank memories by cosine similarity + importance weight
          const rankedMemories = agent.memories
            .map(mem => {
              let baseScore = 0;
              if (mem.embedding) {
                try {
                  const memVector = JSON.parse(mem.embedding);
                  baseScore = cosineSimilarity(wishVector, memVector);
                } catch {
                  // Fallback score if parsing fails
                }
              }
              // Calculate weighted score (base score + 5% boost per importance point)
              const importanceBoost = (mem.importance || 1) * 0.05;
              const finalScore = baseScore + importanceBoost;

              return { ...mem, score: finalScore, baseScore };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3); // Top 3 most relevant memories

          memoryContext = "\nRelevant Agent Memories for this task:\n" + 
            rankedMemories.map(m => `- ${m.key}: ${m.value}`).join("\n");
        }
      }

      agentContext = `
You are assuming the persona of: ${agent.name}
${agent.systemPrompt}
Personality: ${agent.personality || "Professional"}
${memoryContext}
      `;
    }
  }

  // Step 1: Orchestrator analyzes the wish & image context (Fast, small model)
  const orchestratorPrompt = imageAnalysis 
    ? `User Wish: ${userWish}\n\nImage Analysis Details:\n${imageAnalysis}`
    : userWish;

  const orchestration = await generateObject({
    model: OrchestratorModel,
    providerOptions: { openrouter: { max_tokens: 1000 } },
    system: "You are the JINI Orchestrator. Analyze the user's wish. Output a RoutingDecision to classify the request's complexity, domain, vision requirements, and execution mode.",
    prompt: orchestratorPrompt,
    schema: z.object({
      complexity: z.number().describe("1-10 score of technical or business complexity"),
      domain: z.enum(['engineering', 'research', 'business', 'creative', 'governance']),
      visionRequired: z.boolean(),
      executionMode: z.string(),
    }),
  });

  const intentContext = `Domain: ${orchestration.object.domain}\nComplexity: ${orchestration.object.complexity}/10\nExecution Mode: ${orchestration.object.executionMode}`;

  // Step 1.5: Dynamic Agent Routing using the Model Matrix
  let activeModel = CeoModel;
  let domainFocus = "Focus on deep logical reasoning, business strategy, and comprehensive workflows.";

  switch(orchestration.object.domain) {
    case "engineering":
      activeModel = DeveloperModel;
      domainFocus = "Focus heavily on software architecture, strict technical implementation details, scalable code structures, and best practices.";
      break;
    case "research":
      activeModel = DataModel;
      domainFocus = "Focus on deep data analysis, market intelligence, competitor research, and analytical problem solving.";
      break;
    case "business":
      activeModel = CeoModel;
      domainFocus = "Focus on executive strategy, product-market fit, financial models, and go-to-market roadmaps.";
      break;
    case "governance":
      activeModel = QaModel;
      domainFocus = "Focus on QA, security, compliance, risk mitigation, and structural perfection.";
      break;
    case "creative":
      activeModel = CeoModel; // CEO/Marketing handles creative in our matrix
      domainFocus = "Focus heavily on creative design, user experience, branding, narrative, and aesthetic appeal.";
      break;
  }

  // Step 2: Selected Specialist builds the blueprint (streamed)
  let systemPrompt = agentContext ? 
    `${JINI_CORE_DIRECTIVE}\n\n${agentContext}\n\nContext from Orchestrator:\n${intentContext}\n\nDOMAIN FOCUS: ${domainFocus}\n\nCRITICAL INSTRUCTION: You MUST format your entire response as a valid JSON object matching the exact schema provided. Fill out EVERY field (title, masterPrompt, executiveSummary, architecture, agentWorkflow, executionPlan, recommendedTools, qualityScore) with detailed, formatted Markdown. Do NOT output a single monolithic response; break it down into the specific JSON fields requested.` 
    : 
    `${JINI_CORE_DIRECTIVE}\n\nYou must generate a World Class business or technical blueprint based on the user's wish.\n\nContext from Orchestrator:\n${intentContext}\n\nDOMAIN FOCUS: ${domainFocus}\n\nCRITICAL INSTRUCTION: You MUST format your entire response as a valid JSON object matching the exact schema provided. Fill out EVERY field (title, masterPrompt, executiveSummary, architecture, agentWorkflow, executionPlan, recommendedTools, qualityScore) with detailed, formatted Markdown. Do NOT output a single monolithic response; break it down into the specific JSON fields requested. Be authoritative, precise, and use premium vocabulary.`;

  if (imageAnalysis) {
    systemPrompt += `\n\nImage Analysis Context:\n${imageAnalysis}\n\nSince the user provided an image, you MUST synthesize its UI layout, styling, and design principles into your architecture and execution plan. Crucially, the "masterPrompt" field should include the reconstructed image generation prompt to allow the user to reproduce the aesthetics. IMPORTANT GUARDRAIL: Your masterPrompt must absolutely NEVER contain trademarked character names, copyrighted IPs, or specific movie styles (e.g., NEVER use "Spider-Man", "Spider-Verse", "Marvel", "Disney"). You must actively sanitize the user's request. Describe visual appearances and artistic aesthetics using highly descriptive, generic terms (e.g., "agile masked superhero in a red and blue suit", "stylized 3D animated comic book style with halftone patterns") to ensure it passes all third-party image generation safety guardrails.`;
  }

  const result = await streamObject({
    model: activeModel,
    providerOptions: { openrouter: { max_tokens: 8000 } },
    schema: blueprintSchema,
    system: systemPrompt,
    prompt: imageAnalysis ? `User Wish: ${userWish}\n\nImage Context: ${imageAnalysis}` : `User Wish: ${userWish}`,
    async onFinish({ object }) {
      // Save to database if user is authenticated
      if (session?.user?.id && object) {
        try {
          // 1. Create a Project wrapper
          const project = await prisma.project.create({
            data: {
              userId: session.user.id,
              name: object.title || "Untitled Project",
              description: object.executiveSummary?.substring(0, 200) || null,
              type: "Blueprint",
            }
          });

          // 2. Save the Blueprint
          await prisma.blueprint.create({
            data: {
              projectId: project.id,
              title: object.title || "Generated Blueprint",
              rawWish: userWish,
              masterPrompt: object.masterPrompt,
              executiveSummary: object.executiveSummary,
              architecture: object.architecture,
              features: `### Core Features & Workflows\n\n${object.agentWorkflow}\n\n### Recommended Tools\n\n${object.recommendedTools}`,
              executionPlan: object.executionPlan,
              qualityScore: typeof object.qualityScore === 'number' ? object.qualityScore : parseFloat(object.qualityScore as string) || null,
              clarityScore: object.clarityScore,
              structureScore: object.structureScore,
              reasoningScore: object.reasoningScore,
              optimizationScore: object.optimizationScore,
              conversionScore: object.conversionScore,
            }
          });

          // 3. Log the Generation
          await prisma.generation.create({
            data: {
              userId: session.user.id,
              input: userWish,
              output: JSON.stringify(object),
              model: "deepseek-r1",
            }
          });
        } catch (error) {
          console.error("Failed to save blueprint to DB:", error);
        }
      }
    }
  });

  return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error("AI Generation Error:", error);
    const err = error as any;
    let message = err.message || "An unexpected error occurred during generation.";
    const status = err.statusCode || 500;
    
    if (err.responseBody) {
      try {
        const parsed = typeof err.responseBody === 'string' ? JSON.parse(err.responseBody) : err.responseBody;
        if (parsed?.error?.message) {
          message = parsed.error.message;
        }
      } catch {
        // Ignore parse error
      }
    }
    
    return new Response(message, { status });
  }
}
