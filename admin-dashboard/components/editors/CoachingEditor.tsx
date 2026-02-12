'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function CoachingEditor() {
  const [coachingData, setCoachingData] = useState({
    title: 'Elite Coaching. Personalized Systems. Proven Results.',
    subtitle: 'Built in the NFL. Engineered for Real Life.',
    description: 'Every coaching engagement begins with a comprehensive assessment of where you are — physically, mentally, and systemically. From there, we build your custom operating system.',
    ctaText: 'Apply for Coaching',
    ctaLink: '/apply',
  });

  const handleUpdate = (field: string, value: string) => {
    setCoachingData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Coaching Section</h3>
        <p className="text-sm text-zinc-400">
          Edit the coaching page headline, description, and call-to-action.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="coaching-title" className="text-zinc-300">Title</Label>
          <Input
            id="coaching-title"
            value={coachingData.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="coaching-subtitle" className="text-zinc-300">Subtitle</Label>
          <Input
            id="coaching-subtitle"
            value={coachingData.subtitle}
            onChange={(e) => handleUpdate('subtitle', e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="coaching-desc" className="text-zinc-300">Description</Label>
          <Textarea
            id="coaching-desc"
            value={coachingData.description}
            onChange={(e) => handleUpdate('description', e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white mt-1.5 min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="coaching-cta-text" className="text-zinc-300">CTA Button Text</Label>
            <Input
              id="coaching-cta-text"
              value={coachingData.ctaText}
              onChange={(e) => handleUpdate('ctaText', e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="coaching-cta-link" className="text-zinc-300">CTA Button Link</Label>
            <Input
              id="coaching-cta-link"
              value={coachingData.ctaLink}
              onChange={(e) => handleUpdate('ctaLink', e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white mt-1.5"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
