'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2 } from 'lucide-react';

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

interface PackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: Package | null;
  onSave: (pkg: Package) => void;
}

const emptyPackage: Package = {
  id: '',
  name: '',
  slug: '',
  description: '',
  price: '',
  duration: '',
  features: [''],
  ctaText: 'Apply Now',
  ctaLink: '/apply',
  recommended: false,
  active: true,
};

export function PackageDialog({ open, onOpenChange, package: pkg, onSave }: PackageDialogProps) {
  const [formData, setFormData] = useState<Package>(emptyPackage);

  useEffect(() => {
    if (pkg) {
      setFormData(pkg);
    } else {
      setFormData(emptyPackage);
    }
  }, [pkg, open]);

  const handleUpdate = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureUpdate = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg p-6 max-h-[85vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-semibold text-white">
            {pkg ? 'Edit Package' : 'Create Package'}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-zinc-400 mt-1">
            {pkg ? 'Update package details below.' : 'Fill in the details for the new package.'}
          </Dialog.Description>

          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleUpdate('name', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1.5"
                  placeholder="Foundation"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleUpdate('slug', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1.5"
                  placeholder="foundation"
                />
              </div>
            </div>

            <div>
              <Label className="text-zinc-300">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleUpdate('description', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white mt-1.5"
                placeholder="Package description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Price ($)</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => handleUpdate('price', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1.5"
                  placeholder="2997"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Duration</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => handleUpdate('duration', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1.5"
                  placeholder="12 weeks"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-zinc-300">Features</Label>
                <button
                  onClick={addFeature}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureUpdate(index, e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Feature description"
                    />
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-zinc-500 hover:text-red-400 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">CTA Text</Label>
                <Input
                  value={formData.ctaText}
                  onChange={(e) => handleUpdate('ctaText', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1.5"
                />
              </div>
              <div>
                <Label className="text-zinc-300">CTA Link</Label>
                <Input
                  value={formData.ctaLink}
                  onChange={(e) => handleUpdate('ctaLink', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1.5"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.recommended}
                  onChange={(e) => handleUpdate('recommended', e.target.checked)}
                  className="rounded border-zinc-600"
                />
                Recommended
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleUpdate('active', e.target.checked)}
                  className="rounded border-zinc-600"
                />
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-700">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {pkg ? 'Save Changes' : 'Create Package'}
            </Button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
