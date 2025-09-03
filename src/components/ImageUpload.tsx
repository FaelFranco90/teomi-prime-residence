import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Upload, Image as ImageIcon, Star, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heic2any from 'heic2any';

interface ImageSettings {
  url: string;
  isPrimary: boolean;
  isPublic: boolean;
}

interface NewImageSettings {
  file: File;
  isPrimary: boolean;
  isPublic: boolean;
}

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  existingImages?: string[];
  onExistingImagesChange?: (images: string[]) => void;
  imageSettings?: ImageSettings[];
  onImageSettingsChange?: (settings: ImageSettings[]) => void;
  newImageSettings?: NewImageSettings[];
  onNewImageSettingsChange?: (settings: NewImageSettings[]) => void;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  existingImages = [], 
  onExistingImagesChange,
  imageSettings = [],
  onImageSettingsChange,
  newImageSettings = [],
  onNewImageSettingsChange
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  // Initialize settings if not provided
  const initializeExistingSettings = () => {
    if (imageSettings.length === 0 && existingImages.length > 0) {
      const defaultSettings = existingImages.map((url, index) => ({
        url,
        isPrimary: index === 0,
        isPublic: true
      }));
      onImageSettingsChange?.(defaultSettings);
      return defaultSettings;
    }
    return imageSettings;
  };

  const initializeNewSettings = () => {
    if (newImageSettings.length === 0 && images.length > 0) {
      const defaultSettings = images.map((file, index) => ({
        file,
        isPrimary: index === 0 && existingImages.length === 0,
        isPublic: true
      }));
      onNewImageSettingsChange?.(defaultSettings);
      return defaultSettings;
    }
    return newImageSettings;
  };

  const currentExistingSettings = initializeExistingSettings();
  const currentNewSettings = initializeNewSettings();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      await handleFiles(files);
    }
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic')
    );
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Aviso",
        description: "Apenas arquivos de imagem são aceitos.",
        variant: "destructive",
      });
    }

    if (imageFiles.length > 0) {
      const newImages = [...images];
      const newSettings = [...currentNewSettings];
      
      // Processa cada arquivo (converte HEIC se necessário)
      for (const file of imageFiles) {
        if (newImages.length >= 10) {
          toast({
            title: "Limite excedido",
            description: "Máximo de 10 imagens por imóvel.",
            variant: "destructive",
          });
          break;
        }
        
        try {
          let processedFile = file;
          
          // Converte HEIC para JPEG
          if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
            toast({
              title: "Convertendo HEIC",
              description: `Convertendo ${file.name} para JPEG...`,
            });
            
            const convertedBlob = await heic2any({
              blob: file,
              toType: 'image/jpeg',
              quality: 0.8
            }) as Blob;
            
            const fileName = file.name.replace(/\.heic$/i, '.jpg');
            processedFile = new File([convertedBlob], fileName, { type: 'image/jpeg' });
            
            toast({
              title: "Conversão concluída",
              description: `${file.name} convertido com sucesso.`,
            });
          }
          
          newImages.push(processedFile);
          newSettings.push({
            file: processedFile,
            isPrimary: newImages.length === 1 && existingImages.length === 0,
            isPublic: true
          });
        } catch (error) {
          console.error('Erro ao processar arquivo:', error);
          toast({
            title: "Erro de conversão",
            description: `Não foi possível processar ${file.name}. Tente outro formato.`,
            variant: "destructive",
          });
        }
      }
      
      onImagesChange(newImages);
      onNewImageSettingsChange?.(newSettings);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newSettings = currentNewSettings.filter((_, i) => i !== index);
    onImagesChange(newImages);
    onNewImageSettingsChange?.(newSettings);
  };

  const removeExistingImage = (index: number) => {
    if (onExistingImagesChange) {
      const newImages = existingImages.filter((_, i) => i !== index);
      const newSettings = currentExistingSettings.filter((_, i) => i !== index);
      onExistingImagesChange(newImages);
      onImageSettingsChange?.(newSettings);
    }
  };

  const toggleExistingPrimary = (index: number) => {
    const newSettings = currentExistingSettings.map((setting, i) => ({
      ...setting,
      isPrimary: i === index
    }));
    onImageSettingsChange?.(newSettings);
  };

  const toggleNewPrimary = (index: number) => {
    const newSettings = currentNewSettings.map((setting, i) => ({
      ...setting,
      isPrimary: i === index
    }));
    onNewImageSettingsChange?.(newSettings);
  };

  const toggleExistingPublic = (index: number) => {
    const newSettings = [...currentExistingSettings];
    newSettings[index] = { ...newSettings[index], isPublic: !newSettings[index].isPublic };
    onImageSettingsChange?.(newSettings);
  };

  const toggleNewPublic = (index: number) => {
    const newSettings = [...currentNewSettings];
    newSettings[index] = { ...newSettings[index], isPublic: !newSettings[index].isPublic };
    onNewImageSettingsChange?.(newSettings);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}>
        <CardContent className="p-6">
          <div
            className="text-center cursor-pointer"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,.heic"
                onChange={handleChange}
                className="hidden"
              />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  Clique para fazer upload ou arraste as imagens aqui
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, JPEG, HEIC até 5MB cada. Máximo 10 imagens.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Imagens atuais:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingImages.map((imageUrl, index) => {
              const setting = currentExistingSettings[index] || { url: imageUrl, isPrimary: index === 0, isPublic: true };
              return (
                <Card key={index} className="relative overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <img
                        src={imageUrl || '/placeholder.svg'}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {setting.isPrimary && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Principal
                          </Badge>
                        )}
                        {!setting.isPublic && (
                          <Badge variant="secondary" className="text-xs">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Interno
                          </Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => removeExistingImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`existing-primary-${index}`}
                          checked={setting.isPrimary}
                          onCheckedChange={() => toggleExistingPrimary(index)}
                        />
                        <Label htmlFor={`existing-primary-${index}`} className="text-xs">
                          Principal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`existing-public-${index}`}
                          checked={setting.isPublic}
                          onCheckedChange={() => toggleExistingPublic(index)}
                        />
                        <Label htmlFor={`existing-public-${index}`} className="text-xs">
                          Visível no site
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* New Images Preview */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Novas imagens para upload:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => {
              const setting = currentNewSettings[index] || { file: image, isPrimary: index === 0 && existingImages.length === 0, isPublic: true };
              return (
                <Card key={index} className="relative overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {setting.isPrimary && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Principal
                          </Badge>
                        )}
                        {!setting.isPublic && (
                          <Badge variant="secondary" className="text-xs">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Interno
                          </Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs text-background bg-foreground/75 px-2 py-1 rounded truncate">
                          {image.name}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`new-primary-${index}`}
                          checked={setting.isPrimary}
                          onCheckedChange={() => toggleNewPrimary(index)}
                        />
                        <Label htmlFor={`new-primary-${index}`} className="text-xs">
                          Principal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`new-public-${index}`}
                          checked={setting.isPublic}
                          onCheckedChange={() => toggleNewPublic(index)}
                        />
                        <Label htmlFor={`new-public-${index}`} className="text-xs">
                          Visível no site
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      {images.length === 0 && existingImages.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhuma imagem selecionada
          </p>
        </div>
      )}

      {/* Upload Summary */}
      {(images.length > 0 || existingImages.length > 0) && (
        <div className="text-sm text-muted-foreground">
          Total: {existingImages.length + images.length} imagem(s) 
          {images.length > 0 && ` (${images.length} nova(s))`}
        </div>
      )}
    </div>
  );
}
