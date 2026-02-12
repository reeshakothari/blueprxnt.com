import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { content } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getFileContent, updateFile, updateMultipleFiles } from '@/lib/github';

// GET /api/content - Get all content or specific section
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section) {
      const [sectionData] = await db
        .select()
        .from(content)
        .where(eq(content.section, section))
        .limit(1);

      return NextResponse.json(sectionData || null);
    }

    const allContent = await db.select().from(content);
    return NextResponse.json(allContent);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PUT /api/content - Update content section
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, data, published } = body;

    if (!section || !data) {
      return NextResponse.json(
        { error: 'Section and data are required' },
        { status: 400 }
      );
    }

    // Check if section exists
    const [existing] = await db
      .select()
      .from(content)
      .where(eq(content.section, section))
      .limit(1);

    let result;
    if (existing) {
      // Update existing
      [result] = await db
        .update(content)
        .set({
          data,
          published: published ?? existing.published,
          updatedAt: new Date(),
        })
        .where(eq(content.section, section))
        .returning();
    } else {
      // Insert new
      [result] = await db
        .insert(content)
        .values({
          section,
          data,
          published: published ?? false,
        })
        .returning();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// POST /api/content/publish - Publish content to live site via GitHub
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section } = body;

    // Get the content to publish
    const [contentData] = await db
      .select()
      .from(content)
      .where(eq(content.section, section))
      .limit(1);

    if (!contentData) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Update published status in database
    await db
      .update(content)
      .set({
        published: true,
        publishedAt: new Date(),
      })
      .where(eq(content.section, section));

    // Publish to live website via GitHub API
    await updateLiveWebsite(section, contentData.data);

    return NextResponse.json({
      success: true,
      message: 'Content published successfully. Site will redeploy in ~30 seconds.',
    });
  } catch (error) {
    console.error('Error publishing content:', error);
    return NextResponse.json(
      { error: 'Failed to publish content' },
      { status: 500 }
    );
  }
}

// Helper function to update live website files via GitHub API
async function updateLiveWebsite(section: string, data: any) {
  switch (section) {
    case 'hero':
      await updateHeroSection(data);
      break;
    case 'about':
      await updateAboutSection(data);
      break;
    case 'footer':
      await updateFooterSection(data);
      break;
    // Add more sections as needed
  }
}

async function updateHeroSection(data: any) {
  const { content: html } = await getFileContent('index.html');

  let updatedHtml = html;

  updatedHtml = updatedHtml.replace(
    /<p class="hero-tagline">.*?<\/p>/,
    `<p class="hero-tagline">${data.label}</p>`
  );

  updatedHtml = updatedHtml.replace(
    /<h1 class="hero-title">[\s\S]*?<\/h1>/,
    `<h1 class="hero-title">${data.title}</h1>`
  );

  updatedHtml = updatedHtml.replace(
    /<p class="hero-subtitle">.*?<\/p>/,
    `<p class="hero-subtitle">${data.subtitle}</p>`
  );

  await updateFile('index.html', updatedHtml, `Update hero section via admin dashboard`);
}

async function updateAboutSection(data: any) {
  const { content: html } = await getFileContent('about.html');

  let updatedHtml = html;
  // Apply about section updates based on data
  // ... implementation here

  await updateFile('about.html', updatedHtml, `Update about section via admin dashboard`);
}

async function updateFooterSection(data: any) {
  // Footer appears on all pages — update all files in a single commit
  const files = ['index.html', 'about.html', 'coaching.html', 'contact.html', 'system.html'];

  const updatedFiles: { path: string; content: string }[] = [];

  for (const file of files) {
    const { content: html } = await getFileContent(file);

    let updatedHtml = html;
    // Apply footer updates based on data
    // ... implementation here

    updatedFiles.push({ path: file, content: updatedHtml });
  }

  await updateMultipleFiles(updatedFiles, `Update footer section via admin dashboard`);
}
