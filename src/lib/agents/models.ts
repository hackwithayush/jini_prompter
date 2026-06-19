import { createOpenAI } from '@ai-sdk/openai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// 1. Providers

export const localProvider = createOpenAI({
  baseURL: process.env.LOCAL_LLM_URL || 'http://localhost:11434/v1',
  apiKey: process.env.LOCAL_LLM_API_KEY || 'local-no-key-required', 
});

export const openRouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  headers: {
    'HTTP-Referer': 'https://jini.ai',
    'X-Title': 'Jini AI',
  },
});

// 2. Hybrid Routing Engine
const USE_OLLAMA = process.env.USE_OLLAMA === 'true'; 

/**
 * Routes the model request based on environment priority:
 * 1. If USE_OLLAMA is explicitly true, use local Ollama.
 * 2. If OPENROUTER_API_KEY is present, use OpenRouter (Cloud).
 * 3. Fallback to local Ollama if no keys are provided.
 */
function resolveModel(modelName: string | undefined, defaultLocal: string) {
  const target = modelName || defaultLocal;
  
  // Force local if explicitly requested
  if (USE_OLLAMA) {
    return localProvider(target);
  }
  
  // Default to cloud if key exists
  if (process.env.OPENROUTER_API_KEY) {
    return openRouter(target);
  }
  
  // Fallback to local
  return localProvider(target);
}

// 3. V2.1 Specific Agent Models

// Orchestration Layer
export const OrchestratorModel = resolveModel(process.env.ORCHESTRATOR_MODEL, 'deepseek-r1');

// Strategic & Domain Layer
export const CeoModel = resolveModel(process.env.CEO_MODEL, 'deepseek-r1');
export const ProductModel = resolveModel(process.env.PRODUCT_MODEL, 'deepseek-r1');
export const MarketingModel = resolveModel(process.env.MARKETING_MODEL, 'qwen3');
export const SalesModel = resolveModel(process.env.SALES_MODEL, 'qwen3');
export const FinanceModel = resolveModel(process.env.FINANCE_MODEL, 'deepseek-r1');
export const InnovationModel = resolveModel(process.env.INNOVATION_MODEL, 'deepseek-r1');
export const DataModel = resolveModel(process.env.DATA_MODEL, 'deepseek-r1');

export const DeveloperModel = resolveModel(process.env.DEVELOPER_MODEL, 'qwen2.5-coder');
export const UxModel = resolveModel(process.env.UX_MODEL, 'qwen3');
export const DesignModel = resolveModel(process.env.DESIGN_MODEL, 'qwen3');

// Support & Operations Layer
export const ResearchModel = resolveModel(process.env.RESEARCH_MODEL, 'deepseek-r1');
export const DevopsModel = resolveModel(process.env.DEVOPS_MODEL, 'qwen2.5-coder');
export const OperationsModel = resolveModel(process.env.OPERATIONS_MODEL, 'qwen2.5-coder');

// Governance Layer
export const QaModel = resolveModel(process.env.QA_MODEL, 'deepseek-r1');
export const SecurityModel = resolveModel(process.env.SECURITY_MODEL, 'deepseek-r1');

// Shared Vision Layer
export const VisionModel = USE_OPENROUTER && process.env.OPENROUTER_API_KEY
  ? openRouter(process.env.IMAGE_MODEL || 'qwen/qwen-2.5-vl-7b')
  : localProvider(process.env.IMAGE_MODEL || 'qwen2.5-vl');

// Fallback Model for unspecified tasks
export const FallbackModel = localProvider(process.env.MODEL_FALLBACK || DEFAULT_FALLBACK);
