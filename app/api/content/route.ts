import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Content structure for homepage sections
export interface ContentField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'textarea';
  section: string;
}

const defaultContent: ContentField[] = [
  // Hero Section
  { id: 'hero_eyebrow', label: 'Hero Eyebrow Text', value: 'Blueprxnt Performance Health', type: 'text', section: 'Hero' },
  { id: 'hero_title_1', label: 'Hero Title Line 1', value: "The World's First", type: 'text', section: 'Hero' },
  { id: 'hero_title_2', label: 'Hero Title Line 2', value: 'Performance Health', type: 'text', section: 'Hero' },
  { id: 'hero_title_3', label: 'Hero Title Line 3', value: 'Operating System', type: 'text', section: 'Hero' },
  { id: 'hero_subtitle', label: 'Hero Subtitle', value: 'Built in elite sport. Engineered for real life. Transform your health into lasting performance.', type: 'textarea', section: 'Hero' },

  // What Blueprxnt Is Section
  { id: 'what_title', label: 'What It Is - Title', value: 'What Blueprxnt Is', type: 'text', section: 'What Blueprxnt Is' },
  { id: 'what_subtitle', label: 'What It Is - Subtitle', value: 'A complete performance health system built on proven methods from elite sport — not another wellness program.', type: 'textarea', section: 'What Blueprxnt Is' },

  // The Problem Section
  { id: 'problem_title', label: 'Problem - Title', value: 'The Problem', type: 'text', section: 'The Problem' },
  { id: 'problem_subtitle', label: 'Problem - Subtitle', value: "You know health is important, but you're stuck in the middle.", type: 'textarea', section: 'The Problem' },

  // Why Different Section
  { id: 'why_title', label: 'Why Different - Title', value: 'Why Blueprxnt Is Different', type: 'text', section: 'Why Blueprxnt Is Different' },
  { id: 'why_subtitle', label: 'Why Different - Subtitle', value: 'Most programs focus on one thing. Blueprxnt coordinates everything.', type: 'textarea', section: 'Why Blueprxnt Is Different' },

  // How It Works Section
  { id: 'how_title', label: 'How It Works - Title', value: 'How It Works', type: 'text', section: 'How It Works' },
  { id: 'how_subtitle', label: 'How It Works - Subtitle', value: 'The 5-step Blueprxnt methodology', type: 'textarea', section: 'How It Works' },

  // The System Section
  { id: 'system_title', label: 'System - Title', value: 'The System', type: 'text', section: 'The System' },
  { id: 'system_subtitle', label: 'System - Subtitle', value: 'Blueprxnt Performance Health System: Health training, strength & nutrition planning, recovery protocols, mindset coaching, data tracking.', type: 'textarea', section: 'The System' },

  // Who This Is For Section
  { id: 'who_title', label: 'Who This Is For - Title', value: 'Who This Is For', type: 'text', section: 'Who This Is For' },

  // Final CTA Section
  { id: 'cta_title', label: 'CTA - Title', value: 'Ready to Build Your Performance Health System?', type: 'text', section: 'Final CTA' },
  { id: 'cta_subtitle', label: 'CTA - Subtitle', value: "Apply now. We'll review your information and reach out within 48 hours.", type: 'textarea', section: 'Final CTA' },
];

// GET - Retrieve content from Firestore
export async function GET() {
  try {
    if (!adminDb) {
      console.warn('Firebase Admin DB is not initialized, returning default content');
      return NextResponse.json({
        success: true,
        content: defaultContent
      });
    }

    const contentRef = adminDb.collection('siteContent').doc('homepage');
    const doc = await contentRef.get();

    if (doc.exists) {
      const data = doc.data();
      return NextResponse.json({
        success: true,
        content: data?.fields || defaultContent
      });
    } else {
      // Initialize with default content
      await contentRef.set({ fields: defaultContent });
      return NextResponse.json({
        success: true,
        content: defaultContent
      });
    }
  } catch (error: any) {
    console.error('Error fetching content:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Save content to Firestore
export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({
        success: false,
        error: 'Firebase Admin DB is not initialized'
      }, { status: 503 });
    }

    const body = await request.json();
    const { fields } = body as { fields: ContentField[] };

    if (!fields || !Array.isArray(fields)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid fields format'
      }, { status: 400 });
    }

    const contentRef = adminDb.collection('siteContent').doc('homepage');
    await contentRef.set({ fields, updatedAt: new Date().toISOString() });

    return NextResponse.json({
      success: true,
      message: `Saved ${fields.length} content fields`
    });
  } catch (error: any) {
    console.error('Error saving content:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
