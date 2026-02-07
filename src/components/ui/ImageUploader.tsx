import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { compressImage } from '../../lib/imageUtils';
import { ProjectImage } from '../../types';

interface ImageUploaderProps {
  images: ProjectImage[];
  onImagesChange: (images: ProjectImage[]) => void;
  maxImages?: number;
  maxSizeMB?: number; // default 5
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  onImagesChange,
  maxImages = 10,
  maxSizeMB = 5,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return `Tipo de arquivo inválido: ${file.name}. Use JPEG, PNG, GIF ou WebP.`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Arquivo muito grande: ${file.name}. Máximo de ${maxSizeMB}MB.`;
    }
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Limite de ${maxImages} imagens excedido.`);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    const newImages: ProjectImage[] = [];
    const totalFiles = files.length;
    let completedFiles = 0;

    try {
      for (const file of files) {
        // Validation
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue; // Skip invalid files but try others
        }

        // Compression
        let fileToUpload = file;
        try {
          fileToUpload = await compressImage(file);
        } catch (err) {
          console.warn('Compression failed, using original file', err);
        }

        // Upload to Supabase
        const fileExt = fileToUpload.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('portfolio')
          .upload(filePath, fileToUpload);

        if (uploadError) {
          throw uploadError;
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        newImages.push({
          url: publicUrl,
          caption: '', // Default empty caption
        });

        completedFiles++;
        setProgress((completedFiles / totalFiles) * 100);
      }

      // Update parent state
      onImagesChange([...images, ...newImages]);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Erro ao fazer upload das imagens.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  const updateCaption = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], caption };
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          uploading ? 'bg-zinc-900 border-zinc-700 opacity-50 cursor-not-allowed' : 'border-zinc-700 hover:border-blue-500 hover:bg-zinc-900/50'
        }`}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">Enviando imagens...</p>
                <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-zinc-800 rounded-full">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Clique para fazer upload</p>
                <p className="text-xs text-zinc-400 mt-1">
                  JPG, PNG, GIF, WebP (Max 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Image Preview List */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="group relative bg-zinc-900 rounded-lg border border-white/10 overflow-hidden">
              <div className="aspect-video relative bg-zinc-800">
                <img 
                  src={img.url} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Adicionar legenda..."
                  value={img.caption || ''}
                  onChange={(e) => updateCaption(index, e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-zinc-500 border-none focus:ring-0 p-0"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-xs text-zinc-500 text-right">
        {images.length} / {maxImages} imagens
      </div>
    </div>
  );
};

export default ImageUploader;
