'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function FooterEditor() {
  const [footerData, setFooterData] = useState({
    description: "The world's first performance health operating system. Built in elite sport. Engineered for real life.",
    copyright: '© 2025 BLUEPRXNT. All rights reserved.',
    instagram: 'https://instagram.com/pratikxpatel',
    twitter: 'https://twitter.com/blueprxnt',
    linkedin: 'https://linkedin.com/company/blueprxnt',
  });

  const handleUpdate = (field: string, value: string) => {
    setFooterData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Footer</h3>
        <p className="text-sm text-zinc-400">
          Edit footer content that appears on all pages.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="footer-desc" className="text-zinc-300">Footer Description</Label>
          <Textarea
            id="footer-desc"
            value={footerData.description}
            onChange={(e) => handleUpdate('description', e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="footer-copyright" className="text-zinc-300">Copyright Text</Label>
          <Input
            id="footer-copyright"
            value={footerData.copyright}
            onChange={(e) => handleUpdate('copyright', e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white mt-1.5"
          />
        </div>

        <div>
          <Label className="text-zinc-300 mb-3 block">Social Media Links</Label>
          <div className="space-y-3">
            <div>
              <Label htmlFor="footer-ig" className="text-xs text-zinc-500">Instagram</Label>
              <Input
                id="footer-ig"
                value={footerData.instagram}
                onChange={(e) => handleUpdate('instagram', e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="footer-tw" className="text-xs text-zinc-500">Twitter / X</Label>
              <Input
                id="footer-tw"
                value={footerData.twitter}
                onChange={(e) => handleUpdate('twitter', e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="footer-li" className="text-xs text-zinc-500">LinkedIn</Label>
              <Input
                id="footer-li"
                value={footerData.linkedin}
                onChange={(e) => handleUpdate('linkedin', e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
