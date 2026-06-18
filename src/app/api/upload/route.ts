import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // 1. Validation (MIME type & Size)
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // 2. Storage Setup
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // 3. Staging Process
    // Extract extension or default to .jpg
    const ext = file.type.split('/')[1] || 'jpg';
    const uuid = crypto.randomUUID();
    const filename = `${uuid}.${ext}`;
    const filePath = join(uploadsDir, filename);

    // Save to disk
    await writeFile(filePath, buffer);

    // Return the staged URI
    const stagedUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ url: stagedUrl, success: true }, { status: 201 });

  } catch (error) {
    console.error('Failed to stage image:', error);
    return NextResponse.json({ error: 'Internal server error staging image' }, { status: 500 });
  }
}
