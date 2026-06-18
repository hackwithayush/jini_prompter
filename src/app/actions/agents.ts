"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getAvailableAgents() {
  const session = await auth();
  
  // 1. Fetch public templates
  const templates = await prisma.agent.findMany({
    where: { isTemplate: true, isPublic: true },
    select: { id: true, name: true, category: true }
  });

  // 2. Fetch user's custom agents if authenticated
  let userAgents: {id: string, name: string, category: string | null}[] = [];
  if (session?.user?.id) {
    userAgents = await prisma.agent.findMany({
      where: { userId: session.user.id, isTemplate: false },
      select: { id: true, name: true, category: true }
    });
  }

  return { templates, userAgents };
}
