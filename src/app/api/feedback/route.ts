import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { blueprintId, userRating, feedbackText } = await req.json();

    if (!blueprintId) {
      return NextResponse.json({ error: "blueprintId is required" }, { status: 400 });
    }

    // Only allow authenticated users to submit feedback
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the blueprint exists and belongs to the user
    const blueprint = await prisma.blueprint.findUnique({
      where: { id: blueprintId },
      include: { project: true }
    });

    if (!blueprint || blueprint.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Blueprint not found or unauthorized" }, { status: 404 });
    }

    // Update the blueprint with the feedback
    const updatedBlueprint = await prisma.blueprint.update({
      where: { id: blueprintId },
      data: {
        userRating,
        feedbackText: feedbackText || null
      }
    });

    return NextResponse.json({ success: true, blueprint: updatedBlueprint });
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
