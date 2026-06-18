
import { PricingTier, Testimonial } from './types';

// Pricing Tiers

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Explorer',
    price: '$0',
    period: 'forever',
    description:
      'Perfect for trying JINI and generating your first blueprints.',
    features: [
      '3 blueprints per month',
      'Basic Prompt DNA™ generation',
      '3 AI agents active',
      'Community support',
      'Markdown export',
    ],
    highlighted: false,
    cta: 'Start Free',
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description:
      'For entrepreneurs and teams who need unlimited execution power.',
    features: [
      'Unlimited blueprints',
      'Full Prompt DNA™ engine',
      'All 12 AI agents',
      'Priority generation',
      'PDF + JSON + Markdown export',
      'Blueprint history',
      'Collaboration tools',
      'Priority support',
    ],
    highlighted: true,
    cta: 'Start Building',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description:
      'For organizations that need custom AI agents and dedicated infrastructure.',
    features: [
      'Everything in Professional',
      'Custom AI agent training',
      'Private model deployment',
      'SSO & team management',
      'API access',
      'Dedicated infrastructure',
      'Custom integrations',
      'Dedicated success manager',
      'SLA guarantee',
    ],
    highlighted: false,
    cta: 'Contact Sales',
  },
];

// Testimonials

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah C.',
    role: 'Frontend Dev',
    company: 'Freelance',
    quote:
      'I usually spend an hour writing boilerplate prompts for new side projects. This gave me the whole architecture and database schema in like 30 seconds. Honestly pretty crazy.',
    avatar: 'SC',
    rating: 5,
  },
  {
    id: '2',
    name: 'Marcus R.',
    role: 'Indie Hacker',
    company: '',
    quote:
      'The multi-agent thing actually works well. Having it split into separate "bots" for code vs strategy makes the output way less generic than just asking ChatGPT directly.',
    avatar: 'MR',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emily Z.',
    role: 'Product Designer',
    company: '',
    quote:
      'Used this to generate a feature spec for a client. Saved me from staring at a blank page for two days straight.',
    avatar: 'EZ',
    rating: 5,
  },
  {
    id: '4',
    name: 'David P.',
    role: 'Fullstack Engineer',
    company: '',
    quote:
      "The execution roadmap it generates is actually realistic. It doesn't just say \"build the app\", it breaks it down into sensible MVP phases. Good stuff.",
    avatar: 'DP',
    rating: 5,
  },
];

// Sample Blueprint Content (Used in Blueprint Preview Section)

export const SAMPLE_BLUEPRINT_INPUT =
  'Build an AI-powered fitness coaching app that creates personalized workout plans using computer vision to analyze form and provide real-time feedback';

export const SAMPLE_BLUEPRINT_SECTIONS = {
  executiveSummary: `# FitAI — AI-Powered Fitness Coaching Platform

## Vision
FitAI is a next-generation fitness coaching platform that combines computer vision, machine learning, and personalized training algorithms to deliver gym-quality coaching through a smartphone.

## Market Opportunity
The global fitness app market is projected to reach $15.96B by 2028 (CAGR 21.6%). AI-powered fitness represents a $2.4B sub-segment with 34% YoY growth.

## Key Differentiators
- Real-time form analysis using on-device computer vision
- Adaptive workout plans that evolve with user progress
- Injury prevention through biomechanical analysis
- Social accountability features with AI coaching`,

  architecture: `## Technical Architecture

### Frontend
- **Mobile**: React Native + Expo
- **Web Dashboard**: Next.js 15 + TailwindCSS
- **State Management**: Zustand

### Backend
- **API**: FastAPI (Python)
- **Database**: PostgreSQL + TimescaleDB
- **Cache**: Redis
- **Queue**: Celery + RabbitMQ

### AI/ML Pipeline
- **Pose Estimation**: MediaPipe BlazePose
- **Form Analysis**: Custom TensorFlow model
- **Workout Generation**: Fine-tuned LLM (Llama 3)
- **Progress Prediction**: XGBoost regression`,

  features: `## Core Features

### MVP (Month 1-3)
1. **AI Form Checker** — Real-time exercise form analysis
2. **Smart Workout Generator** — Personalized plans based on goals
3. **Progress Dashboard** — Visual tracking with AI insights
4. **Exercise Library** — 500+ exercises with AI demonstrations

### Growth (Month 4-6)
5. **Social Challenges** — Group fitness competitions
6. **Nutrition Integration** — AI meal planning
7. **Wearable Sync** — Apple Watch, Fitbit integration
8. **Virtual Coach** — Chat-based AI coaching`,

  roadmap: `## Execution Roadmap

### Phase 1: Foundation (Months 1-2)
- Core mobile app with basic workout tracking
- Pose estimation MVP (5 exercises)
- User authentication & onboarding
- Basic workout plan generation

### Phase 2: Intelligence (Months 3-4)
- Full form analysis (50+ exercises)
- Adaptive difficulty algorithms
- Progress analytics dashboard
- Push notification system

### Phase 3: Growth (Months 5-6)
- Social features & challenges
- App Store optimization
- Content marketing launch
- Partnership integrations`,
};

// Hero Section Stats

export const HERO_STATS = [
  { id: 'stat-blueprints', value: '10K+', label: 'Blueprints Generated' },
  { id: 'stat-agents', value: '12', label: 'AI Agents' },
  { id: 'stat-success', value: '98%', label: 'Success Rate' },
  { id: 'stat-time', value: '<30s', label: 'Generation Time' },
];
