import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Upload, X, Check, Image as ImageIcon, ZoomIn, ZoomOut } from 'lucide-react';
import { getCroppedImg } from '../../lib/utils';

interface ImageUploaderProps {
  currentImage?: string | null;
  onImageSelected: (file: Blob) => void;
  onImageRemoved: () => void;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  currentImage, 
  onImageSelected, 
  onImageRemoved,
  className = '' 
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onImageSelected(croppedImage);
        setIsCropping(false);
        setImageSrc(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao cortar imagem.');
    }
  };

  const handleRemove = () => {
    if (window.confirm('Tem certeza que deseja remover a foto?')) {
      onImageRemoved();
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />

      {/* Current Image Display */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full border-2 border-blue-500 p-1 relative group">
          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
            {currentImage ? (
              <img src={currentImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-500" />
            )}
          </div>
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 mx-1"
              title="Alterar foto"
            >
              <Upload size={16} />
            </button>
            {currentImage && (
              <button 
                onClick={handleRemove}
                className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 mx-1"
                title="Remover foto"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="text-sm text-blue-400 hover:text-blue-300 font-medium"
        >
          {currentImage ? 'Alterar Foto' : 'Adicionar Foto'}
        </button>
        <p className="text-xs text-gray-500">JPG ou PNG. Máx 5MB.</p>
      </div>

      {/* Cropper Modal */}
      {isCropping && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="bg-zinc-900 rounded-xl w-full max-w-lg overflow-hidden border border-white/10 shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Ajustar Imagem</h3>
              <button onClick={() => setIsCropping(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="relative h-80 bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <ZoomOut size={16} className="text-gray-400" />
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <ZoomIn size={16} className="text-gray-400" />
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsCropping(false)}
                  className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleCropSave}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                >
                  <Check size={16} /> Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
