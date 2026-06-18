"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { generateEmbedding } from "@/lib/agents/embeddings";

export async function addMemory(agentId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const key = formData.get("key") as string;
  const value = formData.get("value") as string;
  const category = formData.get("category") as string;

  if (!key || !value) return;

  // Validate ownership
  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  if (agent?.userId !== session.user.id) throw new Error("Unauthorized");

  // Generate vector embedding using local nomic-embed-text
  const vector = await generateEmbedding(value);
  const embeddingString = vector.length > 0 ? JSON.stringify(vector) : null;

  await prisma.agentMemory.create({
    data: { 
      agentId, 
      key, 
      value, 
      category,
      embedding: embeddingString 
    }
  });

  revalidatePath(`/dashboard/agents/${agentId}`);
}

export async function deleteMemory(memoryId: string, agentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Since we rely on agentId for revalidation, just directly delete where agentId matches
  const memory = await prisma.agentMemory.findUnique({ where: { id: memoryId }, include: { agent: true } });
  if (memory?.agent.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.agentMemory.delete({ where: { id: memoryId } });

  revalidatePath(`/dashboard/agents/${agentId}`);
}

export async function deleteAgent(agentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  if (agent?.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.agent.delete({ where: { id: agentId } });
  revalidatePath("/dashboard/agents");
  redirect("/dashboard/agents");
}
