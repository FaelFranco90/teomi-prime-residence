import { useCallback, useState } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Upload, Image as ImageIcon, Star, Eye, EyeOff, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heic2any from 'heic2any';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageSettings {
  url: string;
  isPrimary: boolean;
  isPublic: boolean;
  order: number;
}

interface NewImageSettings {
  file: File;
  isPrimary: boolean;
  isPublic: boolean;
  order: number;
}

interface UnifiedImageItem {
  id: string;
  type: 'existing' | 'new';
  index: number; // Original index in the respective array
  url?: string;
  file?: File;
  isPrimary: boolean;
  isPublic: boolean;
  order: number;
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

interface SortableImageItemProps {
  item: UnifiedImageItem;
  onRemove: () => void;
  onTogglePrimary: () => void;
  onTogglePublic: () => void;
  onOrderChange: (newOrder: number) => void;
}

function SortableImageItem({ item, onRemove, onTogglePrimary, onTogglePublic, onOrderChange }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const imageUrl = item.type === 'existing' ? item.url : (item.file ? URL.createObjectURL(item.file) : '');
  
  // Cleanup object URL on unmount to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (item.type === 'new' && item.file && imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl, item.type, item.file]);
  const displayName = item.type === 'existing' ? `Imagem ${item.index + 1}` : item.file?.name || '';

  return (
    <Card ref={setNodeRef} style={style} className="relative overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
          />
          
          {/* Drag Handle */}
          <div 
            className="absolute top-2 left-2 bg-background/80 p-1 rounded cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-12 flex flex-col gap-1">
            {item.isPrimary && (
              <Badge variant="default" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Capa
              </Badge>
            )}
            {!item.isPublic && (
              <Badge variant="secondary" className="text-xs">
                <EyeOff className="h-3 w-3 mr-1" />
                Interno
              </Badge>
            )}
          </div>

          {/* Remove Button */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>

          {/* Order Display */}
          <div className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-xs font-medium">
            {item.isPrimary ? 'Capa' : `Pos. ${item.order}`}
          </div>

          {/* File Name for New Images */}
          {item.type === 'new' && item.file && (
            <div className="absolute bottom-2 left-2">
              <p className="text-xs text-background bg-foreground/75 px-2 py-1 rounded truncate max-w-32">
                {item.file.name}
              </p>
            </div>
          )}
        </div>

        <div className="p-3 space-y-3">
          {/* Order Input */}
          <div className="flex items-center space-x-2">
            <Label className="text-xs min-w-[60px]">Posição:</Label>
            <Input
              type="number"
              min={item.isPrimary ? 0 : 1}
              max={50}
              value={item.isPrimary ? 0 : item.order}
              onChange={(e) => {
                const newOrder = parseInt(e.target.value) || 1;
                if (item.isPrimary && newOrder !== 0) {
                  // If trying to change cover position, make it non-primary first
                  onTogglePrimary();
                  setTimeout(() => onOrderChange(newOrder), 100);
                } else if (!item.isPrimary && newOrder === 0) {
                  onTogglePrimary();
                } else {
                  onOrderChange(newOrder);
                }
              }}
              className="h-7 text-xs"
              disabled={item.isPrimary}
            />
          </div>

          {/* Primary Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id={`primary-${item.id}`}
              checked={item.isPrimary}
              onCheckedChange={onTogglePrimary}
            />
            <Label htmlFor={`primary-${item.id}`} className="text-xs">
              Imagem de capa (posição 0)
            </Label>
          </div>

          {/* Public Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id={`public-${item.id}`}
              checked={item.isPublic}
              onCheckedChange={onTogglePublic}
            />
            <Label htmlFor={`public-${item.id}`} className="text-xs">
              Visível no site
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize settings if not provided
  const initializeExistingSettings = () => {
    if (imageSettings.length === 0 && existingImages.length > 0) {
      const defaultSettings = existingImages.map((url, index) => ({
        url,
        isPrimary: index === 0,
        isPublic: true,
        order: index === 0 ? 0 : index
      }));
      onImageSettingsChange?.(defaultSettings);
      return defaultSettings;
    }
    return imageSettings;
  };

  const initializeNewSettings = () => {
    if (newImageSettings.length === 0 && images.length > 0) {
      const hasPrimaryInExisting = imageSettings.some(s => s.isPrimary);
      const defaultSettings = images.map((file, index) => ({
        file,
        isPrimary: index === 0 && !hasPrimaryInExisting,
        isPublic: true,
        order: index + 1
      }));
      onNewImageSettingsChange?.(defaultSettings);
      return defaultSettings;
    }
    return newImageSettings;
  };

  const currentExistingSettings = initializeExistingSettings();
  const currentNewSettings = initializeNewSettings();

  // Create unified items list for display
  const createUnifiedItems = (): UnifiedImageItem[] => {
    const items: UnifiedImageItem[] = [];

    // Add existing images
    existingImages.forEach((url, index) => {
      const setting = currentExistingSettings[index] || { 
        url, 
        isPrimary: index === 0, 
        isPublic: true, 
        order: index === 0 ? 0 : index 
      };
      items.push({
        id: `existing-${index}`,
        type: 'existing',
        index,
        url,
        isPrimary: setting.isPrimary,
        isPublic: setting.isPublic,
        order: setting.order
      });
    });

    // Add new images
    images.forEach((file, index) => {
      const setting = currentNewSettings[index] || { 
        file, 
        isPrimary: false, 
        isPublic: true, 
        order: index + 1 
      };
      items.push({
        id: `new-${index}`,
        type: 'new',
        index,
        file,
        isPrimary: setting.isPrimary,
        isPublic: setting.isPublic,
        order: setting.order
      });
    });

    // Sort by order (primary images first, then by order)
    return items.sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return a.order - b.order;
    });
  };

  const unifiedItems = createUnifiedItems();

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
      const totalCurrentImages = existingImages.length + images.length;
      const remainingSlots = 50 - totalCurrentImages;
      
      if (remainingSlots <= 0) {
        toast({
          title: "Limite atingido",
          description: "Máximo de 50 imagens neste cadastro. Remova algumas imagens para adicionar novas.",
          variant: "destructive",
        });
        return;
      }

      const filesToProcess = imageFiles.slice(0, remainingSlots);
      if (filesToProcess.length < imageFiles.length) {
        toast({
          title: "Limite parcialmente atingido",
          description: `Apenas ${filesToProcess.length} de ${imageFiles.length} imagens foram adicionadas para respeitar o limite de 50 imagens.`,
          variant: "destructive",
        });
      }

      const newImages = [...images];
      const newSettings = [...currentNewSettings];
      const hasPrimary = currentExistingSettings.some(s => s.isPrimary) || currentNewSettings.some(s => s.isPrimary);
      
      // Get next available order number
      const allOrders = [
        ...currentExistingSettings.map(s => s.order),
        ...currentNewSettings.map(s => s.order)
      ];
      let nextOrder = Math.max(0, ...allOrders) + 1;
      
      for (const file of filesToProcess) {
        try {
          let processedFile = file;
          
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
            isPrimary: !hasPrimary && newImages.length === 1,
            isPublic: true,
            order: nextOrder++
          });
          } catch (error) {
            console.error('Error processing file:', error);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = unifiedItems.findIndex(item => item.id === active.id);
      const overIndex = unifiedItems.findIndex(item => item.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedItems = arrayMove(unifiedItems, activeIndex, overIndex);
        
        // Update orders based on new positions
        reorderedItems.forEach((item, index) => {
          if (!item.isPrimary) {
            const newOrder = index + 1;
            updateItemOrder(item, newOrder);
          }
        });
      }
    }
  };

  const updateItemOrder = (item: UnifiedImageItem, newOrder: number) => {
    if (item.type === 'existing') {
      const newSettings = [...currentExistingSettings];
      newSettings[item.index] = { ...newSettings[item.index], order: newOrder };
      onImageSettingsChange?.(newSettings);
    } else {
      const newSettings = [...currentNewSettings];
      newSettings[item.index] = { ...newSettings[item.index], order: newOrder };
      onNewImageSettingsChange?.(newSettings);
    }
  };

  const removeItem = (item: UnifiedImageItem) => {
    if (item.type === 'existing') {
      const newImages = existingImages.filter((_, i) => i !== item.index);
      const newSettings = currentExistingSettings.filter((_, i) => i !== item.index);
      onExistingImagesChange?.(newImages);
      onImageSettingsChange?.(newSettings);
    } else {
      const newImages = images.filter((_, i) => i !== item.index);
      const newSettings = currentNewSettings.filter((_, i) => i !== item.index);
      onImagesChange(newImages);
      onNewImageSettingsChange?.(newSettings);
    }
  };

  const toggleItemPrimary = (item: UnifiedImageItem) => {
    // First, unset all primary flags
    const newExistingSettings = currentExistingSettings.map(s => ({ ...s, isPrimary: false }));
    const newNewSettings = currentNewSettings.map(s => ({ ...s, isPrimary: false }));

    // Then set the selected item as primary
    if (item.type === 'existing') {
      newExistingSettings[item.index] = { ...newExistingSettings[item.index], isPrimary: !item.isPrimary, order: item.isPrimary ? 1 : 0 };
    } else {
      newNewSettings[item.index] = { ...newNewSettings[item.index], isPrimary: !item.isPrimary, order: item.isPrimary ? 1 : 0 };
    }

    onImageSettingsChange?.(newExistingSettings);
    onNewImageSettingsChange?.(newNewSettings);
  };

  const toggleItemPublic = (item: UnifiedImageItem) => {
    if (item.type === 'existing') {
      const newSettings = [...currentExistingSettings];
      newSettings[item.index] = { ...newSettings[item.index], isPublic: !newSettings[item.index].isPublic };
      onImageSettingsChange?.(newSettings);
    } else {
      const newSettings = [...currentNewSettings];
      newSettings[item.index] = { ...newSettings[item.index], isPublic: !newSettings[item.index].isPublic };
      onNewImageSettingsChange?.(newSettings);
    }
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
                  PNG, JPG, JPEG, HEIC até 5MB cada. Máximo 50 imagens neste cadastro. Limite total do sistema: 100 por imóvel.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unified Images List with Drag & Drop */}
      {unifiedItems.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Imagens do imóvel:</p>
            <Badge variant="outline" className="text-xs">
              {unifiedItems.length} / 50 imagens
            </Badge>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={unifiedItems.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unifiedItems.map((item) => (
                  <SortableImageItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item)}
                    onTogglePrimary={() => toggleItemPrimary(item)}
                    onTogglePublic={() => toggleItemPublic(item)}
                    onOrderChange={(newOrder) => updateItemOrder(item, newOrder)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Empty State */}
      {unifiedItems.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhuma imagem selecionada
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Arraste imagens para reordenar • Posição 0 = Capa • Posições 1-50 = Ordem no site
          </p>
        </div>
      )}
    </div>
  );
}