import { NextRequest, NextResponse } from 'next/server';
import { getFileContent, updateMultipleFiles } from '@/lib/github';

// All scannable HTML files with display names
const HTML_FILES = [
  { file: 'index.html', name: 'Home' },
  { file: 'system.html', name: 'System' },
  { file: 'coaching.html', name: 'Coaching' },
  { file: 'about.html', name: 'About' },
  { file: 'contact.html', name: 'Contact' },
];

// Tags that contain editable text
const EDITABLE_TAGS = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'a', 'button', 'li', 'label'];

// Classes to skip (structural/non-text elements)
const SKIP_CLASSES = [
  'nav-menu', 'nav-container', 'hero-background', 'hero-cta-group',
  'trusted-divider-line', 'mobile-menu-toggle', 'footer-bottom-links',
];

interface ScannedField {
  id: string;
  file: string;
  className: string;
  tag: string;
  text: string;
  section: string;
  occurrence: number;
  type: 'text';
}

interface ScannedImage {
  id: string;
  file: string;
  src: string;
  alt: string;
  section: string;
  occurrence: number;
  type: 'image';
}

interface ScannedTestimonial {
  id: string;
  file: string;
  badge: string;
  text: string;
  author: string;
  position: string;
  section: string;
  occurrence: number;
  type: 'testimonial';
}

type ScannedContent = ScannedField | ScannedImage | ScannedTestimonial;

// Helper: Detect sections from HTML comments
function detectSections(html: string): { name: string; pos: number }[] {
  const sectionRegex = /<!--\s*(.+?)\s*-->/g;
  const sections: { name: string; pos: number }[] = [];
  let sectionMatch;
  while ((sectionMatch = sectionRegex.exec(html)) !== null) {
    const name = sectionMatch[1].trim();
    if (name.length < 50 && !name.startsWith('/')  && !name.includes('Google') && !name.includes('script')) {
      sections.push({ name, pos: sectionMatch.index });
    }
  }
  return sections;
}

// Helper: Get section name for a position
function getSection(pos: number, sections: { name: string; pos: number }[]): string {
  let current = 'Top';
  for (const s of sections) {
    if (s.pos <= pos) current = s.name;
    else break;
  }
  return current;
}

// Scan text elements with class names
function scanTextFields(html: string, fileName: string, sections: { name: string; pos: number }[]): ScannedField[] {
  const fields: ScannedField[] = [];
  const classCount: Record<string, number> = {};

  const tagPattern = EDITABLE_TAGS.join('|');
  const elementRegex = new RegExp(
    `<(${tagPattern})([^>]*class="([^"]+)"[^>]*)>([\\s\\S]*?)<\\/\\1>`,
    'gi'
  );

  let match;
  while ((match = elementRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const classAttr = match[3];
    const rawContent = match[4];
    const pos = match.index;

    const classes = classAttr.split(/\s+/).filter(c => c.length > 0);
    const primaryClass = classes[0];

    if (!primaryClass) continue;
    if (SKIP_CLASSES.some(sc => classes.includes(sc))) continue;

    let text = rawContent.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');

    if (text.length < 2 || text.length > 500) continue;

    const classKey = `${fileName}:${primaryClass}`;
    classCount[classKey] = (classCount[classKey] || 0) + 1;
    const occurrence = classCount[classKey];

    const fieldId = occurrence > 1
      ? `${fileName}::${primaryClass}::${occurrence}`
      : `${fileName}::${primaryClass}`;

    fields.push({
      id: fieldId,
      file: fileName,
      className: primaryClass,
      tag,
      text,
      section: getSection(pos, sections),
      occurrence,
      type: 'text',
    });
  }

  return fields;
}

// Scan images
function scanImages(html: string, fileName: string, sections: { name: string; pos: number }[]): ScannedImage[] {
  const images: ScannedImage[] = [];
  const srcCount: Record<string, number> = {};

  const imgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi;

  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    const alt = match[2];
    const pos = match.index;

    if (src.includes('logo.png')) continue;

    const srcKey = `${fileName}:${src}`;
    srcCount[srcKey] = (srcCount[srcKey] || 0) + 1;
    const occurrence = srcCount[srcKey];

    const imageId = occurrence > 1
      ? `${fileName}::img::${src}::${occurrence}`
      : `${fileName}::img::${src}`;

    images.push({
      id: imageId,
      file: fileName,
      src,
      alt,
      section: getSection(pos, sections),
      occurrence,
      type: 'image',
    });
  }

  return images;
}

// Scan testimonials
function scanTestimonials(html: string, fileName: string, sections: { name: string; pos: number }[]): ScannedTestimonial[] {
  const testimonials: ScannedTestimonial[] = [];
  let occurrence = 0;

  const testimonialRegex = /<div\s+class="testimonial-box"[^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class="testimonial-box"|<\/div>)/gi;

  let match;
  while ((match = testimonialRegex.exec(html)) !== null) {
    const content = match[1];
    const pos = match.index;

    const badgeMatch = content.match(/<span\s+class="testimonial-badge"[^>]*>([\s\S]*?)<\/span>/i);
    const badge = badgeMatch ? badgeMatch[1].trim() : '';

    const textMatch = content.match(/<p\s+class="testimonial-text"[^>]*>([\s\S]*?)<\/p>/i);
    const text = textMatch ? textMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    const authorMatch = content.match(/<p\s+class="testimonial-author"[^>]*>([\s\S]*?)<\/p>/i);
    const author = authorMatch ? authorMatch[1].trim() : '';

    const positionMatch = content.match(/<p\s+class="testimonial-position"[^>]*>([\s\S]*?)<\/p>/i);
    const position = positionMatch ? positionMatch[1].trim() : '';

    occurrence++;

    const testimonialId = `${fileName}::testimonial::${occurrence}`;

    testimonials.push({
      id: testimonialId,
      file: fileName,
      badge,
      text,
      author,
      position,
      section: getSection(pos, sections),
      occurrence,
      type: 'testimonial',
    });
  }

  return testimonials;
}

// Replace the Nth occurrence of a class's text content
function replaceByClassOccurrence(
  html: string,
  className: string,
  occurrence: number,
  newText: string
): string {
  const tagPattern = EDITABLE_TAGS.join('|');
  const regex = new RegExp(
    `(<(?:${tagPattern})[^>]*class="[^"]*\\b${className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[^"]*"[^>]*>)([\\s\\S]*?)(<\\/(?:${tagPattern})>)`,
    'gi'
  );

  let count = 0;
  return html.replace(regex, (fullMatch, openTag, content, closeTag) => {
    count++;
    if (count !== occurrence) return fullMatch;

    const hasInnerTags = /<[^>]+>/.test(content);
    if (hasInnerTags) {
      let replaced = false;
      const newContent = content.replace(/^(\s*)([^<]+)/, (_: string, ws: string, _txt: string) => {
        replaced = true;
        return `${ws}${newText}`;
      });
      if (replaced) return `${openTag}${newContent}${closeTag}`;
      return `${openTag}${newText}${closeTag}`;
    }

    return `${openTag}${newText}${closeTag}`;
  });
}

// Replace image src and alt
function replaceImage(html: string, oldSrc: string, occurrence: number, newSrc: string, newAlt: string): string {
  const escapedSrc = oldSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const imgRegex = new RegExp(`(<img\\s+[^>]*src="${escapedSrc}"[^>]*alt=")([^"]*)("[^>]*>)`, 'gi');

  let count = 0;
  return html.replace(imgRegex, (fullMatch, before, oldAlt, after) => {
    count++;
    if (count !== occurrence) return fullMatch;
    return `${before}${newAlt}${after}`.replace(
      new RegExp(`(src=")${escapedSrc}(")`, 'i'),
      `$1${newSrc}$2`
    );
  });
}

// Replace testimonial content
function replaceTestimonial(
  html: string,
  occurrence: number,
  newBadge: string,
  newText: string,
  newAuthor: string,
  newPosition: string
): string {
  const testimonialRegex = /<div\s+class="testimonial-box"[^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class="testimonial-box"|<\/div>)/gi;

  let count = 0;
  return html.replace(testimonialRegex, (fullMatch, content) => {
    count++;
    if (count !== occurrence) return fullMatch;

    let updated = content;
    updated = updated.replace(
      /(<span\s+class="testimonial-badge"[^>]*>)([\s\S]*?)(<\/span>)/i,
      `$1${newBadge}$3`
    );
    updated = updated.replace(
      /(<p\s+class="testimonial-text"[^>]*>)([\s\S]*?)(<\/p>)/i,
      `$1${newText}$3`
    );
    updated = updated.replace(
      /(<p\s+class="testimonial-author"[^>]*>)([\s\S]*?)(<\/p>)/i,
      `$1${newAuthor}$3`
    );
    updated = updated.replace(
      /(<p\s+class="testimonial-position"[^>]*>)([\s\S]*?)(<\/p>)/i,
      `$1${newPosition}$3`
    );

    return `<div class="testimonial-box">${updated}</div>`;
  });
}

// GET - Scan all HTML files from GitHub and return structured content
export async function GET() {
  try {
    const allContent: ScannedContent[] = [];

    for (const { file } of HTML_FILES) {
      try {
        const { content: html } = await getFileContent(file);
        const sections = detectSections(html);

        const textFields = scanTextFields(html, file, sections);
        const images = scanImages(html, file, sections);
        const testimonials = scanTestimonials(html, file, sections);

        allContent.push(...textFields, ...images, ...testimonials);
      } catch (e) {
        // File not found on GitHub, skip
      }
    }

    // Group by file and section
    const grouped: Record<string, Record<string, ScannedContent[]>> = {};
    for (const item of allContent) {
      const pageName = HTML_FILES.find(f => f.file === item.file)?.name || item.file;
      if (!grouped[pageName]) grouped[pageName] = {};
      if (!grouped[pageName][item.section]) grouped[pageName][item.section] = [];
      grouped[pageName][item.section].push(item);
    }

    return NextResponse.json({ success: true, content: allContent, grouped });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Publish changes to HTML files via GitHub API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { changes } = body as {
      changes: Array<
        | { type: 'text'; id: string; className: string; file: string; occurrence: number; newText: string }
        | { type: 'image'; id: string; file: string; oldSrc: string; occurrence: number; newSrc: string; newAlt: string }
        | { type: 'testimonial'; id: string; file: string; occurrence: number; newBadge: string; newText: string; newAuthor: string; newPosition: string }
      >;
    };

    if (!changes || !Array.isArray(changes)) {
      return NextResponse.json({ success: false, error: 'Invalid changes format' }, { status: 400 });
    }

    // Group changes by file
    const byFile: Record<string, typeof changes> = {};
    for (const change of changes) {
      if (!byFile[change.file]) byFile[change.file] = [];
      byFile[change.file].push(change);
    }

    const results: Record<string, number> = {};
    const updatedFiles: { path: string; content: string }[] = [];

    for (const [file, fileChanges] of Object.entries(byFile)) {
      let html: string;
      try {
        const { content: fileContent } = await getFileContent(file);
        html = fileContent;
      } catch (e) {
        continue;
      }

      for (const change of fileChanges) {
        if (change.type === 'text') {
          html = replaceByClassOccurrence(html, change.className, change.occurrence, change.newText);
        } else if (change.type === 'image') {
          html = replaceImage(html, change.oldSrc, change.occurrence, change.newSrc, change.newAlt);
        } else if (change.type === 'testimonial') {
          html = replaceTestimonial(html, change.occurrence, change.newBadge, change.newText, change.newAuthor, change.newPosition);
        }
      }

      updatedFiles.push({ path: file, content: html });
      results[file] = fileChanges.length;
    }

    // Commit all file changes in a single commit via GitHub API
    if (updatedFiles.length > 0) {
      const changedPages = Object.keys(results).join(', ');
      await updateMultipleFiles(
        updatedFiles,
        `Update content on ${changedPages} via admin dashboard`
      );
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'Changes published. Site will redeploy in ~30 seconds.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
