// ============================================================================
// JINI PROMPTER — Type Definitions
// The World's First AI Blueprint Architect
// ============================================================================

// ---------------------------------------------------------------------------
// Blueprint & Core Generation Types
// ---------------------------------------------------------------------------

export interface Blueprint {
  id: string;
  title: string;
  inputPrompt: string;
  executiveSummary: string;
  features: Feature[];
  architecture: ArchitectureSpec;
  techStack: TechStackItem[];
  roadmap: RoadmapPhase[];
  budget: BudgetEstimate;
  risks: Risk[];
  monetization: MonetizationStrategy[];
  status: 'generating' | 'completed' | 'error';
  createdAt: Date;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'must-have' | 'should-have' | 'nice-to-have';
  complexity: 'low' | 'medium' | 'high';
  estimatedDays: number;
}

export interface ArchitectureSpec {
  frontend: string;
  backend: string;
  database: string;
  infrastructure: string;
  diagram: string; // mermaid diagram string
}

export interface TechStackItem {
  category: string;
  technology: string;
  reason: string;
}

export interface RoadmapPhase {
  phase: number;
  name: string;
  duration: string;
  milestones: string[];
  deliverables: string[];
}

export interface BudgetEstimate {
  totalEstimate: string;
  breakdown: { category: string; amount: string }[];
}

export interface Risk {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
}

export interface MonetizationStrategy {
  model: string;
  description: string;
  projectedRevenue: string;
}

// ---------------------------------------------------------------------------
// Agent System Types
// ---------------------------------------------------------------------------

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // hex color
  status: 'idle' | 'thinking' | 'working' | 'completed';
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

export interface AgentDefinition {
  id: string;
  name: string;
  layer: string;
  role: string;
  description: string;
  icon: string;
  color: string;
  capabilities: string[];
  visionCapabilities: string[];
  expectedOutputs: string[];
  tools: string[];
  reasoningStyle: string;
  communicationStyle: string;
  confidenceThreshold: number;
  delegationRules: string[];
  collaboratesWith: string[];
  executionModes?: string[];
  specializationScore?: number;
  governanceChecks?: string[];
}

export interface AgentDNA {
  version: string;
  layer: string;
  role: string;
  capabilities: string[];
  visionCapabilities: string[];
  expectedOutputs: string[];
  reasoningStyle: string;
  communicationStyle: string;
  confidenceThreshold: number;
  delegationRules: string[];
  collaboratesWith: string[];
  specializationScore: number;
  executionModes?: string[];
}

// ---------------------------------------------------------------------------
// Pricing & Testimonials
// ---------------------------------------------------------------------------

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  rating: number;
}

// ---------------------------------------------------------------------------
// Navigation & UI
// ---------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
}

export interface CognitiveStage {
  number: number;
  name: string;
  description: string;
  outputs: string[];
  icon: string;
}

export interface JiniFeature {
  id: string;
  name: string;
  trademark: string;
  description: string;
  icon: string;
}
