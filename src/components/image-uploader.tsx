
'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud, Camera } from 'lucide-react';
import { Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onCameraClick: () => void;
}

export default function ImageUploader({ onImageSelect, onCameraClick }: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFile(e.target.files?.[0]);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-xl text-center shadow-2xl shadow-primary/10 animate-fade-in rounded-2xl border-0">
      <CardHeader className="pt-10">
        <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold sm:text-4xl">
          <Leaf className="text-primary h-10 w-10"/>
          AgriAide
        </CardTitle>
        <CardDescription className="pt-2 text-base sm:text-lg">
          Votre assistant IA pour la santé des plantes
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-12 transition-colors',
            'border-border',
            isDragActive ? 'border-primary bg-primary/5' : ''
          )}
        >
          <input ref={inputRef} type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleChange} />
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <UploadCloud className="h-16 w-16 text-primary/70" />
            <p className="font-semibold text-lg">Glissez-déposez une image ici</p>
            <p className="text-sm">ou</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <Button type="button" onClick={onButtonClick} size="lg" className="w-full">
                Parcourir les fichiers
              </Button>
              <Button type="button" onClick={onCameraClick} variant="outline" size="lg" className="w-full">
                 <Camera className="mr-2 h-5 w-5" />
                Prendre une photo
              </Button>
            </div>
            <p className="text-xs mt-4">Formats supportés : PNG, JPG, JPEG, WEBP</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

    