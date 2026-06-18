"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function createAgent(formData: FormData) {
  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const systemPrompt = formData.get("systemPrompt") as string;
  const personality = formData.get("personality") as string;
  
  // JSON stringified fields from hidden inputs
  const tools = formData.get("tools") as string;
  const goals = formData.get("goals") as string;
  const dna = formData.get("dna") as string;

  if (!userId || !name || !systemPrompt) {
    throw new Error("Missing required fields");
  }

  await prisma.agent.create({
    data: {
      userId,
      name,
      description,
      category,
      systemPrompt,
      personality,
      tools,
      goals,
      dna,
      isTemplate: false,
      isPublic: false,
    }
  });

  revalidatePath("/dashboard/agents");
  redirect("/dashboard/agents");
}

export async function cloneAgent(agentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  if (!agent) throw new Error("Agent not found");

  await prisma.agent.create({
    data: {
      userId: session.user.id,
      name: `${agent.name} (Clone)`,
      description: agent.description,
      category: agent.category,
      systemPrompt: agent.systemPrompt,
      personality: agent.personality,
      tools: agent.tools,
      goals: agent.goals,
      dna: agent.dna,
      isTemplate: false,
      isPublic: false,
    }
  });

  revalidatePath("/dashboard/agents");
}

export async function importAgent(agentData: {
  name?: string;
  description?: string | null;
  category?: string | null;
  systemPrompt?: string;
  personality?: string | null;
  tools?: string | null;
  goals?: string | null;
  dna?: string | null;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.agent.create({
    data: {
      userId: session.user.id,
      name: agentData.name || "Imported Agent",
      description: agentData.description,
      category: agentData.category,
      systemPrompt: agentData.systemPrompt || "Default Prompt",
      personality: agentData.personality,
      tools: agentData.tools,
      goals: agentData.goals,
      dna: agentData.dna,
      isTemplate: false,
      isPublic: false,
    }
  });

  revalidatePath("/dashboard/agents");
}
