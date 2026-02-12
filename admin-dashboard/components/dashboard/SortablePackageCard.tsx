'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2, Star } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  recommended: boolean;
  active: boolean;
}

interface SortablePackageCardProps {
  package: Package;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortablePackageCard({ package: pkg, onEdit, onDelete }: SortablePackageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: pkg.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="bg-zinc-800 border-zinc-700 p-4">
        <div className="flex items-center gap-4">
          <button
            className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold">{pkg.name}</h3>
              {pkg.recommended && (
                <span className="flex items-center gap-1 text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3" />
                  Recommended
                </span>
              )}
              {!pkg.active && (
                <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400 truncate">{pkg.description}</p>
          </div>

          <div className="text-right mr-4">
            <p className="text-white font-bold">${pkg.price}</p>
            <p className="text-xs text-zinc-500">{pkg.duration}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
