'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Testimonial {
  id: string;
  badge: string;
  text: string;
  author: string;
  position: string;
}

export function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      badge: 'TRANSFORMATION',
      text: 'The Blueprxnt system completely changed how I approach my health. It\'s not a diet — it\'s an operating system for life.',
      author: 'Client Name',
      position: 'Position / Title',
    },
  ]);

  const handleAdd = () => {
    setTestimonials([
      ...testimonials,
      {
        id: Date.now().toString(),
        badge: 'RESULTS',
        text: '',
        author: '',
        position: '',
      },
    ]);
  };

  const handleRemove = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    setTestimonials(testimonials.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Testimonials</h3>
          <p className="text-sm text-zinc-400">
            Manage client testimonials shown on the homepage.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <div className="space-y-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">
                Testimonial #{index + 1}
              </span>
              <button
                onClick={() => handleRemove(testimonial.id)}
                className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <Label className="text-xs text-zinc-500">Badge</Label>
              <Input
                value={testimonial.badge}
                onChange={(e) => handleUpdate(testimonial.id, 'badge', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="TRANSFORMATION"
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-500">Testimonial Text</Label>
              <Textarea
                value={testimonial.text}
                onChange={(e) => handleUpdate(testimonial.id, 'text', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white mt-1 min-h-[80px]"
                placeholder="Client testimonial..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-500">Author Name</Label>
                <Input
                  value={testimonial.author}
                  onChange={(e) => handleUpdate(testimonial.id, 'author', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-500">Position / Title</Label>
                <Input
                  value={testimonial.position}
                  onChange={(e) => handleUpdate(testimonial.id, 'position', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="CEO, Company"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
