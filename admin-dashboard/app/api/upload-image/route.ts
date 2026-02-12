import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToGitHub } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${originalName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to GitHub repo (commits the image file)
    const relativePath = await uploadImageToGitHub(
      fileName,
      buffer,
      `Upload image: ${originalName} via admin dashboard`
    );

    return NextResponse.json({
      success: true,
      path: relativePath,
      fileName: fileName,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
