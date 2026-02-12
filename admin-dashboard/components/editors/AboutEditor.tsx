'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function AboutEditor() {
  const [aboutData, setAboutData] = useState({
    label: 'ABOUT ME',
    title: "I Didn't Start Healthy. I Earned It.",
    intro: "I wasn't always fit, confident, or comfortable in my own body. As a first-generation Indian-American, I grew up overweight, struggling with self-esteem, and constantly comparing myself to others.",
    story: 'Sports were my passion, but I rarely saw anyone who looked like me succeed at the highest level. That gap between where I was and where I wanted to be became the fuel for everything that followed.',
    mission: 'Working at the highest levels of sport taught me what most people never see — that elite performance isn\'t about talent. It\'s about systems, consistency, and the right framework.',
  });

  const handleUpdate = (field: string, value: string) => {
    setAboutData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">About Section</h3>
        <p className="text-sm text-zinc-400">
          Edit the about page content and your personal story.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="about-label" className="text-zinc-300">Section Label</Label>
          <Input
            id="about-label"
            value={aboutData.label}
            onChange={(e) => handleUpdate('label', e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="about-title" className="text-zinc-300">Title</Label>
          <Input
            id="about-title"
            value={aboutData.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="about-intro" className="text-zinc-300">Introduction</Label>
          <Textarea
            id="about-intro"
            value={aboutData.intro}
            onChange={(e) => handleUpdate('intro', e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white mt-1.5 min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="about-story" className="text-zinc-300">Story</Label>
          <Textarea
            id="about-story"
            value={aboutData.story}
            onChange={(e) => handleUpdate('story', e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white mt-1.5 min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="about-mission" className="text-zinc-300">Mission</Label>
          <Textarea
            id="about-mission"
            value={aboutData.mission}
            onChange={(e) => handleUpdate('mission', e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white mt-1.5 min-h-[120px]"
          />
        </div>
      </div>
    </Card>
  );
}
