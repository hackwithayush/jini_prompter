import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { AGENT_DEFINITIONS } from '../src/lib/constants';

const templates = AGENT_DEFINITIONS.map(agent => {
  const dna = {
    version: "2.1",
    layer: agent.layer,
    role: agent.role,
    capabilities: agent.capabilities,
    visionCapabilities: agent.visionCapabilities,
    expectedOutputs: agent.expectedOutputs,
    tools: agent.tools,
    reasoningStyle: agent.reasoningStyle,
    communicationStyle: agent.communicationStyle,
    confidenceThreshold: agent.confidenceThreshold,
    executionModes: agent.executionModes || [],
    delegationRules: agent.delegationRules,
    collaboratesWith: agent.collaboratesWith,
    governanceChecks: agent.governanceChecks || ["QA", "Security"],
    specializationScore: agent.specializationScore || 80
  };

  return {
    name: agent.name,
    description: agent.description,
    category: agent.layer,
    systemPrompt: `You are the JINI ${agent.name}. Your role is ${agent.role} within the ${agent.layer} Layer. Focus on: ${agent.description}. Provide actionable, highly analytical, and structurally sound responses.\n\nCapabilities: ${agent.capabilities.join(", ")}\nVision Capabilities: ${agent.visionCapabilities.join(", ")}\nExpected Outputs: ${agent.expectedOutputs.join(", ")}\nReasoning Style: ${agent.reasoningStyle}\nCommunication Style: ${agent.communicationStyle}`,
    personality: `${agent.reasoningStyle}, ${agent.communicationStyle}`,
    dna: JSON.stringify(dna),
    goals: JSON.stringify(agent.expectedOutputs),
    rules: JSON.stringify(agent.delegationRules),
    tools: JSON.stringify(agent.tools)
  };
});

async function main() {
  console.log("Seeding Database...");

  // 1. Create a system user for the templates
  const systemUser = await prisma.user.upsert({
    where: { email: "system@jiniprompter.com" },
    update: {},
    create: {
      name: "JINI System",
      email: "system@jiniprompter.com",
      role: "SUPER_ADMIN",
    },
  });

  console.log("System User Created:", systemUser.id);

  console.log("Cleaning up old templates...");
  await prisma.agent.deleteMany({ where: { isTemplate: true } });

  // 2. Seed Templates
  for (const t of templates) {
    const agent = await prisma.agent.create({
      data: {
        userId: systemUser.id,
        name: t.name,
        description: t.description,
        category: t.category,
        systemPrompt: t.systemPrompt,
        personality: t.personality,
        dna: t.dna,
        goals: t.goals,
        rules: t.rules,
        tools: t.tools,
        isTemplate: true,
        isPublic: true,
      }
    });
    console.log(`Created Template: ${agent.name} (${t.category})`);
  }

  console.log("Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
