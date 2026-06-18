import { streamText } from 'ai';
import { CeoModel, DeveloperModel, ProductModel, OperationsModel, FallbackModel } from '@/lib/agents/models';
import { AGENT_DEFINITIONS } from '@/lib/constants';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, section, imageAnalysis } = await req.json();

  // Determine which V2 Agent handles this section
  let activeModel = FallbackModel;
  let agentContext = "";
  let sectionFocus = "";

  if (section === 'executiveSummary') {
    activeModel = CeoModel;
    const ceo = AGENT_DEFINITIONS.find(a => a.name === 'CEO Agent');
    agentContext = `You are the ${ceo?.name}. Role: ${ceo?.role}. ${ceo?.description}`;
    sectionFocus = "Write the Executive Summary. Focus on high-level business strategy, value proposition, and market impact. Format with clear Markdown.";
  } else if (section === 'architecture') {
    activeModel = DeveloperModel;
    const dev = AGENT_DEFINITIONS.find(a => a.name === 'Developer Agent');
    agentContext = `You are the ${dev?.name}. Role: ${dev?.role}. ${dev?.description}`;
    sectionFocus = "Write the Architecture section. Focus heavily on software architecture, tech stack recommendations (frontend, backend, database), scalable code structures, and strict technical implementation details. Format with clear Markdown.";
  } else if (section === 'features') {
    activeModel = ProductModel;
    const prod = AGENT_DEFINITIONS.find(a => a.name === 'Product Agent');
    agentContext = `You are the ${prod?.name}. Role: ${prod?.role}. ${prod?.description}`;
    sectionFocus = "Write the Features section. Focus on detailed core features, AI agent workflows, user journeys, and UX recommendations. Format with clear Markdown.";
  } else if (section === 'roadmap') {
    activeModel = OperationsModel;
    const ops = AGENT_DEFINITIONS.find(a => a.name === 'Operations Agent');
    agentContext = `You are the ${ops?.name}. Role: ${ops?.role}. ${ops?.description}`;
    sectionFocus = "Write the Roadmap section. Formulate a step-by-step execution plan and timeline. Format with clear Markdown.";
  } else {
    // Fallback
    activeModel = FallbackModel;
    sectionFocus = "Provide an expert analysis.";
  }

  const systemPrompt = `
# JINI CORE: PARALLEL EXECUTION AGENT
You are currently operating in Parallel Execution Mode. 
${agentContext}

**CRITICAL INSTRUCTION**:
${sectionFocus}

**AGENT FORGE V2 CORE DIRECTIVE**
You are operating at principal-level expertise.
Requirements:
- Think deeply before responding.
- Verify assumptions & Identify risks.
- Challenge weak logic.
- Produce implementation-ready outputs.
- Prefer evidence over opinions.
- Optimize for business value.

You are generating ONLY the content for the "${section}" section of the user's blueprint. Do NOT output a JSON object. Do NOT wrap your response in JSON. Output ONLY raw Markdown text tailored to this specific section. Do not explain your thought process. Execute immediately.
`;

  const result = await streamText({
    model: activeModel,
    system: systemPrompt,
    prompt: imageAnalysis ? `User Wish: ${prompt}\n\nImage Context: ${imageAnalysis}` : `User Wish: ${prompt}`,
  });

  return result.toTextStreamResponse();
}
