'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud, Leaf, Camera } from 'lucide-react';
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
    <Card className="w-full max-w-lg text-center shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
          <Leaf className="text-primary"/>
          Détection des maladies des plantes
        </CardTitle>
        <CardDescription className="pt-2">
          Téléchargez une image claire d'une feuille de plante ou utilisez votre appareil photo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-12 transition-colors',
            'border-border',
            isDragActive ? 'border-primary bg-primary/10' : ''
          )}
        >
          <input ref={inputRef} type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleChange} />
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <UploadCloud className="h-12 w-12" />
            <p className="font-semibold">Glissez-déposez une image ici</p>
            <div className="flex items-center gap-2">
              <Button type="button" onClick={onButtonClick} variant="outline">
                Parcourir
              </Button>
              <span className="text-sm">ou</span>
              <Button type="button" onClick={onCameraClick} variant="outline">
                 <Camera className="mr-2 h-4 w-4" />
                Prendre une photo
              </Button>
            </div>
            <p className="text-sm mt-2">Formats supportés : PNG, JPG, JPEG, WEBP</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
