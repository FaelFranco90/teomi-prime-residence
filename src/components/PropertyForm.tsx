import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/hooks/useSupabaseProperties';
import { ImageUpload } from './ImageUpload';
import { Loader2, Wand2, CheckCircle, Trash2 } from 'lucide-react';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';
import { SelectedOwner } from '@/types/owners';
import { fetchOwnersForProperty, syncPropertyOwners } from '@/hooks/useOwners';
import PropertyOwnersSection from '@/components/admin/PropertyOwnersSection';
import { useAuthHook } from '@/hooks/useAuth';

const propertySchema = z.object({
  city: z.string().min(1, 'Cidade é obrigatória'),
  neighborhood: z.string().optional(),
  condo_name: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  cep: z.string().optional(),
  price: z.string().min(1, 'Preço é obrigatório'),
  area: z.string().min(1, 'Área total é obrigatória'),
  area_usable: z.number().min(0).default(0),
  property_type: z.string().min(1, 'Tipo é obrigatório'),
  description: z.string().optional(),
  youtube_video_url: z.string().optional().refine((val) => {
    if (!val) return true; // Optional field
    return /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/.test(val);
  }, 'URL do YouTube inválida'),
  bedrooms: z.number().min(0).default(0),
  bathrooms: z.number().min(0).default(0),
  suites: z.number().min(0).default(0),
  parking: z.number().min(0).default(0),
  is_featured: z.boolean().default(false),
  is_exclusive: z.boolean().default(false),
  is_new: z.boolean().default(false),
  has_virtual_tour: z.boolean().default(false),
  is_gated_community: z.boolean().default(false),
  is_published: z.boolean().default(true),
  status: z.enum(['active', 'sold', 'inactive']).default('active'),
  title: z.string().min(1, 'Título é obrigatório'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  property?: Property;
  onSuccess: () => void;
  onCancel: () => void;
}

interface PropertyImageRecord {
  id: string;
  image_url: string;
  is_primary: boolean;
  is_public: boolean;
  order_index: number;
}

export function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingImageRecords, setExistingImageRecords] = useState<PropertyImageRecord[]>([]);
  const [originalImageRecords, setOriginalImageRecords] = useState<PropertyImageRecord[]>([]);
  const [existingImageSettings, setExistingImageSettings] = useState<any[]>([]);
  const [newImageSettings, setNewImageSettings] = useState<any[]>([]);
  const [savedPropertyCode, setSavedPropertyCode] = useState<string | null>(null);
  const { toast } = useToast();
  const { types, loading: typesLoading } = usePropertyTypes();
  const { isAdmin } = useAuthHook();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property ? {
      title: property.title,
      city: property.city || '',
      neighborhood: property.neighborhood || '',
      condo_name: property.condoName || '',
      address: property.address || '',
      state: property.state || '',
      cep: property.cep || '',
      price: property.price,
      area: property.area,
      area_usable: 0, // Will be loaded from property data if available
      property_type: property.propertyType || '',
      description: '',
      youtube_video_url: property.youtubeVideoUrl || '',
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      suites: property.suites,
      parking: property.parking,
      is_featured: property.featured || false,
      is_exclusive: property.exclusive || false,
      is_new: property.isNew || false,
      has_virtual_tour: property.virtualTour || false,
      is_gated_community: property.gatedCommunity || false,
      is_published: true,
      status: 'active' as const,
    } : {
      bedrooms: 0,
      bathrooms: 0,
      suites: 0,
      parking: 0,
      area_usable: 0,
      is_featured: false,
      is_exclusive: false,
      is_new: false,
      has_virtual_tour: false,
      is_gated_community: false,
      is_published: true,
      status: 'active' as const,
      title: '',
    }
  });

  const selectedType = watch('property_type');

  // Proprietários (interno)
  const [selectedOwners, setSelectedOwners] = useState<SelectedOwner[]>([]);

  // Load complete property image records for proper ID-based management
  useEffect(() => {
    let ignore = false;
    const loadPropertyImages = async () => {
      if (property?.id) {
        try {
          console.log('🔄 Loading property images for', property.id);
          const { data: imageRecords, error } = await supabase
            .from('property_images')
            .select('id, image_url, is_primary, is_public, order_index')
            .eq('property_id', property.id)
            .order('order_index');
          
          if (error) throw error;
          
          if (!ignore && imageRecords) {
            console.log('📸 Loaded', imageRecords.length, 'image records');
            setExistingImageRecords(imageRecords);
            setOriginalImageRecords([...imageRecords]); // Deep copy for comparison
            
            // Initialize existingImages (URLs) and settings from database
            const urls = imageRecords.map(record => record.image_url);
            const settings = imageRecords.map(record => ({
              isPrimary: record.is_primary,
              isPublic: record.is_public
            }));
            
            setExistingImages(urls);
            setExistingImageSettings(settings);
          }
        } catch (e) {
          console.error('Erro ao carregar imagens do imóvel:', e);
        }
      } else {
        // New property - initialize empty
        setExistingImages([]);
        setExistingImageRecords([]);
        setOriginalImageRecords([]);
        setExistingImageSettings([]);
      }
    };
    loadPropertyImages();
    return () => { ignore = true; };
  }, [property?.id]);

  useEffect(() => {
    let ignore = false;
    const loadOwners = async () => {
      if (property?.id) {
        try {
          const data = await fetchOwnersForProperty(property.id);
          if (!ignore) setSelectedOwners(data);
        } catch (e) {
          console.error('Erro ao carregar proprietários do imóvel:', e);
        }
      } else {
        setSelectedOwners([]);
      }
    };
    loadOwners();
    return () => { ignore = true; };
  }, [property?.id]);

  const convertPriceToNumber = (priceStr: string): number => {
    if (priceStr === "Sob Consulta") return 0;
    return parseInt(priceStr.replace(/[^\d]/g, ''));
  };

  const convertAreaToNumber = (areaStr: string): number => {
    return parseInt(areaStr.replace(/[^\d]/g, ''));
  };

  const generateTitleSuggestion = () => {
    const formData = watch();
    const propertyTypeLabel = types.find(t => t.key === formData.property_type)?.label || formData.property_type;
    
    if (!propertyTypeLabel || !formData.bedrooms || !formData.area || !formData.price || !formData.city) {
      toast({
        title: "Informações insuficientes",
        description: "Preencha tipo, quartos, área, preço e cidade para gerar sugestão.",
        variant: "destructive"
      });
      return;
    }

    const bedroomsText = formData.bedrooms > 0 ? `com ${formData.bedrooms} dormitório${formData.bedrooms > 1 ? 's' : ''}` : '';
    const locationParts = [formData.condo_name, formData.neighborhood, formData.city, formData.state].filter(Boolean);
    const location = locationParts.join(' - ');
    
    const suggestion = `${propertyTypeLabel} ${bedroomsText} à venda, ${formData.area} por ${formData.price} - ${location}`.trim();
    
    setValue('title', suggestion);
    toast({
      title: "Título sugerido aplicado",
      description: "Você pode editá-lo conforme necessário."
    });
  };

  const persistExistingImageChanges = async (propertyId: string) => {
    try {
      console.log('🔄 Starting persistExistingImageChanges for property:', propertyId);
      
      // Create map of current URL -> record for efficient lookup
      const currentUrlToRecord = new Map<string, PropertyImageRecord>();
      existingImageRecords.forEach(record => {
        if (existingImages.includes(record.image_url)) {
          currentUrlToRecord.set(record.image_url, record);
        }
      });

      // 1. Detect removed images by comparing original records vs current URLs
      const currentUrls = existingImages;
      const originalUrls = originalImageRecords.map(record => record.image_url);
      const removedUrls = originalUrls.filter(url => !currentUrls.includes(url));
      const removedRecords = originalImageRecords.filter(record => removedUrls.includes(record.image_url));

      // 2. Delete removed images from storage and database
      if (removedRecords.length > 0) {
        console.log('🗑️ Deleting', removedRecords.length, 'images:', removedUrls);
        toast({
          title: "Removendo imagens...",
          description: `Excluindo ${removedRecords.length} imagem(ns) do sistema.`
        });

        for (const removedRecord of removedRecords) {
          // Delete from database by ID (most reliable)
          console.log('🗑️ Deleting from DB by ID:', removedRecord.id);
          const { error: dbError } = await supabase
            .from('property_images')
            .delete()
            .eq('id', removedRecord.id);

          if (dbError) {
            console.error('❌ Database delete error for ID', removedRecord.id, ':', dbError);
            
            // Fallback: try to delete by property_id + URL with ILIKE
            console.log('🔄 Trying fallback deletion with ILIKE for URL:', removedRecord.image_url);
            const { error: fallbackError } = await supabase
              .from('property_images')
              .delete()
              .eq('property_id', propertyId)
              .ilike('image_url', `%${removedRecord.image_url}%`);
            
            if (fallbackError) {
              console.error('❌ Fallback delete also failed:', fallbackError);
              throw dbError; // Throw original error
            } else {
              console.log('✅ Fallback deletion succeeded');
            }
          } else {
            console.log('✅ Database deletion by ID succeeded');
          }

          // Delete from storage if it's a Supabase URL
          if (removedRecord.image_url.includes('supabase.co') && removedRecord.image_url.includes('property-images')) {
            try {
              // Extract file path from URL: /storage/v1/object/public/property-images/...
              const urlParts = removedRecord.image_url.split('/storage/v1/object/public/property-images/');
              if (urlParts.length > 1) {
                const filePath = urlParts[1];
                console.log('🗑️ Deleting from storage:', filePath);
                const { error: storageError } = await supabase.storage
                  .from('property-images')
                  .remove([filePath]);
                
                if (storageError) {
                  console.error('❌ Storage delete error:', storageError);
                } else {
                  console.log('✅ Storage deletion succeeded');
                }
              }
            } catch (e) {
              console.error('❌ Error deleting from storage:', e);
            }
          }
        }
      }

      // 3. Update is_primary and is_public flags for remaining existing images using IDs
      if (existingImages.length > 0) {
        console.log('✏️ Updating', existingImages.length, 'existing image settings');
        
        for (let i = 0; i < existingImages.length; i++) {
          const imageUrl = existingImages[i];
          const settings = existingImageSettings[i];
          const record = currentUrlToRecord.get(imageUrl);
          
          if (settings && record) {
            console.log('✏️ Updating image settings for ID:', record.id);
            const { error: updateError } = await supabase
              .from('property_images')
              .update({
                is_primary: settings.isPrimary || false,
                is_public: settings.isPublic !== undefined ? settings.isPublic : true,
              })
              .eq('id', record.id);

            if (updateError) {
              console.error('❌ Error updating image settings for ID', record.id, ':', updateError);
              throw updateError;
            } else {
              console.log('✅ Updated settings for image ID:', record.id);
            }
          }
        }
      }

      // 4. Ensure exactly one primary image exists
      const { data: primaryImages } = await supabase
        .from('property_images')
        .select('id, image_url, is_primary')
        .eq('property_id', propertyId)
        .eq('is_primary', true);

      if (!primaryImages || primaryImages.length === 0) {
        // No primary image, set the first one as primary
        console.log('🔄 No primary image found, setting first as primary');
        const { data: firstImage } = await supabase
          .from('property_images')
          .select('id')
          .eq('property_id', propertyId)
          .order('order_index')
          .limit(1)
          .maybeSingle();

        if (firstImage) {
          await supabase
            .from('property_images')
            .update({ is_primary: true })
            .eq('id', firstImage.id);
          console.log('✅ Set first image as primary:', firstImage.id);
        }
      } else if (primaryImages.length > 1) {
        // Multiple primary images, keep only the first one
        console.log('⚠️ Multiple primary images found, keeping only first');
        for (let i = 1; i < primaryImages.length; i++) {
          await supabase
            .from('property_images')
            .update({ is_primary: false })
            .eq('id', primaryImages[i].id);
        }
      }

      console.log('✅ Image changes persisted successfully');
    } catch (error) {
      console.error('❌ Error persisting image changes:', error);
      toast({
        title: "Erro ao processar imagens",
        description: "Algumas alterações nas imagens podem não ter sido salvas.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);
    try {
      const basePropertyData = {
        title: data.title,
        city: data.city,
        neighborhood: data.neighborhood || null,
        condo_name: data.condo_name || null,
        address: data.address || null,
        state: data.state || null,
        cep: data.cep || null,
        location: [data.condo_name, data.neighborhood, data.city].filter(Boolean).join(', '),
        price: data.price,
        area: data.area,
        area_usable: data.area_usable || 0,
        property_type: data.property_type,
        description: data.description,
        youtube_video_url: data.youtube_video_url || null,
        bedrooms: data.bedrooms ?? 0,
        bathrooms: data.bathrooms ?? 0,
        suites: data.suites ?? 0,
        parking: data.parking ?? 0,
        is_featured: data.is_featured ?? false,
        is_exclusive: data.is_exclusive ?? false,
        is_new: data.is_new ?? false,
        has_virtual_tour: data.has_virtual_tour ?? false,
        is_gated_community: data.is_gated_community ?? false,
        is_published: data.is_published ?? true,
        status: data.status ?? 'active',
        price_number: convertPriceToNumber(data.price),
        area_number: convertAreaToNumber(data.area),
      };

      let propertyId: string;
      let newPropertyCode: string | null = null;

      if (property) {
        // Update existing property - don't send code field
        const { error } = await supabase
          .from('properties')
          .update(basePropertyData)
          .eq('id', property.id);

        if (error) throw error;
        propertyId = property.id;
        newPropertyCode = property.code; // Keep existing code
      } else {
        // Create new property - include empty code to trigger auto-generation
        const propertyData = {
          ...basePropertyData,
          code: '', // Empty string will trigger auto-generation
        };
        
        const { data: newProperty, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();

        if (error) throw error;
        propertyId = newProperty.id;
        newPropertyCode = newProperty.code;
      }

      // Persist existing image changes (deletions, settings updates)
      if (property) {
        console.log('💾 Persisting existing image changes...');
        await persistExistingImageChanges(propertyId);
      }

      // Handle image uploads if there are new images
      if (images.length > 0) {
        console.log('📤 Uploading new images...');
        await handleImageUploads(propertyId);
      }

      // Sincroniza proprietários (interno, não público)
      if (selectedOwners && selectedOwners.length >= 0) {
        try {
          await syncPropertyOwners(propertyId, selectedOwners);
        } catch (e) {
          console.error('Erro ao sincronizar proprietários:', e);
        }
      }

      // Reload images from database to reflect true state
      if (property) {
        console.log('🔄 Reloading images from database...');
        try {
          const { data: updatedImageRecords, error } = await supabase
            .from('property_images')
            .select('id, image_url, is_primary, is_public, order_index')
            .eq('property_id', propertyId)
            .order('order_index');
          
          if (!error && updatedImageRecords) {
            setExistingImageRecords(updatedImageRecords);
            setOriginalImageRecords([...updatedImageRecords]);
            
            const urls = updatedImageRecords.map(record => record.image_url);
            const settings = updatedImageRecords.map(record => ({
              isPrimary: record.is_primary,
              isPublic: record.is_public
            }));
            
            setExistingImages(urls);
            setExistingImageSettings(settings);
            console.log('✅ Reloaded', updatedImageRecords.length, 'images from database');
          }
        } catch (e) {
          console.error('❌ Error reloading images:', e);
        }
      }

      setSavedPropertyCode(newPropertyCode);
      
      toast({
        title: property ? "Imóvel atualizado" : "Imóvel criado",
        description: property 
          ? "As alterações foram salvas com sucesso." 
          : `O novo imóvel foi cadastrado com sucesso. Código: ${newPropertyCode}`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
      
      let errorMessage = "Não foi possível salvar o imóvel. Tente novamente.";
      let errorTitle = "Erro ao salvar";
      
      if (error && typeof error === 'object' && 'message' in error) {
        const supabaseError = error as any;
        
        // Verificar erros específicos do Supabase
        if (supabaseError.message?.includes('Limite de 100 imagens por imóvel')) {
          errorTitle = "Limite de imagens atingido";
          errorMessage = "Este imóvel já tem o máximo de 100 imagens permitido pelo sistema. Remova algumas imagens antes de adicionar novas.";
        } else if (supabaseError.code === '42501' || supabaseError.message?.includes('insufficient_privilege') || supabaseError.message?.includes('permission denied')) {
          errorTitle = "Erro de Permissão";
          errorMessage = "Você não tem permissão para realizar esta operação. Verifique se está logado como administrador ou editor.";
        } else if (supabaseError.code === '23505' || supabaseError.message?.includes('duplicate key')) {
          errorTitle = "Código Duplicado";
          errorMessage = "Este código de imóvel já existe. Escolha um código diferente.";
        } else if (supabaseError.message) {
          errorMessage = `Erro: ${supabaseError.message}`;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploads = async (propertyId: string) => {
    if (images.length === 0) return;

    const uploadPromises = images.map(async (image, index) => {
      try {
        const fileName = `${propertyId}_${Date.now()}_${index}.${image.name.split('.').pop()}`;
        const filePath = `imoveis/${propertyId}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('property-images').upload(filePath, image);
        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw new Error(`Erro ao fazer upload da imagem ${image.name}: ${uploadError.message}`);
        }
        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(filePath);

        // Get settings for this image
        const setting = newImageSettings[index] || { isPrimary: index === 0 && existingImages.length === 0, isPublic: true };

        const { error: dbError } = await supabase.from('property_images').insert({
          property_id: propertyId,
          image_url: publicUrl,
          is_primary: setting.isPrimary,
          is_public: setting.isPublic,
          order_index: existingImages.length + index,
        });
        if (dbError) {
          console.error('Database insert error:', dbError);
          throw new Error(`Erro ao salvar informações da imagem ${image.name}: ${dbError.message}`);
        }
      } catch (error) {
        console.error('Image upload error for', image.name, ':', error);
        throw error;
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleDelete = async () => {
    if (!property?.id) return;

    setDeleting(true);
    try {
      // Delete images from storage and database
      const { data: images } = await supabase
        .from('property_images')
        .select('image_url')
        .eq('property_id', property.id);

      if (images && images.length > 0) {
        const imagePaths = images
          .map((img) => img.image_url.split('/storage/v1/object/public/property-images/')[1])
          .filter((p): p is string => !!p);

        if (imagePaths.length > 0) {
          await supabase.storage.from('property-images').remove(imagePaths);
        }

        await supabase.from('property_images').delete().eq('property_id', property.id);
      }

      // Delete property owners relationships
      await supabase.from('property_owners').delete().eq('property_id', property.id);

      // Delete the property
      const { error } = await supabase.from('properties').delete().eq('id', property.id);
      if (error) throw error;

      toast({
        title: 'Imóvel excluído',
        description: 'O imóvel foi removido permanentemente do sistema.',
      });
      onSuccess();
    } catch (err: any) {
      const msg = typeof err?.message === 'string' ? err.message : '';
      const description = msg.includes('23503')
        ? 'Não é possível excluir: registro relacionado.'
        : 'Não foi possível excluir o imóvel.';
      toast({
        title: 'Erro ao excluir',
        description,
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{property ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}</CardTitle>
        <CardDescription>
          {property ? 'Atualize as informações do imóvel' : 'Preencha as informações do novo imóvel'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Código do imóvel salvo */}
          {savedPropertyCode && (
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Imóvel salvo com código: {savedPropertyCode}
                </p>
              </div>
            </div>
          )}

          {/* Tipo de Imóvel */}
          <div className="space-y-2">
            <Label htmlFor="property_type">Tipo de Imóvel *</Label>
            <Select
              value={watch('property_type')}
              onValueChange={(value) => setValue('property_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={typesLoading ? 'Carregando tipos...' : 'Selecione o tipo'} />
              </SelectTrigger>
              <SelectContent>
                {types
                  .filter((t) => t.active)
                  .map((t) => (
                    <SelectItem key={t.id} value={t.key}>
                      {t.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.property_type && (
              <p className="text-sm text-destructive">{errors.property_type.message}</p>
            )}
          </div>

          {/* Localização Estruturada */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Localização *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input id="city" {...register('city')} placeholder="Ex: São José dos Campos" />
                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">Estado (UF)</Label>
                <Input id="state" {...register('state')} placeholder="Ex: SP" maxLength={2} />
                {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" {...register('neighborhood')} placeholder="Ex: Alphaville" />
                {errors.neighborhood && <p className="text-sm text-destructive">{errors.neighborhood.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" {...register('cep')} placeholder="Ex: 12345-678" />
                {errors.cep && <p className="text-sm text-destructive">{errors.cep.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condo_name">Condomínio</Label>
                <Input id="condo_name" {...register('condo_name')} placeholder="Ex: Residencial Paradise" />
                {errors.condo_name && <p className="text-sm text-destructive">{errors.condo_name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo (APENAS ADMIN)</Label>
                <Input id="address" {...register('address')} placeholder="Ex: Rua das Palmeiras, 123" />
                <p className="text-xs text-muted-foreground text-yellow-600">
                  ⚠️ Este campo NÃO aparece no site público por segurança
                </p>
                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* Preço e Área */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <Input id="price" {...register('price')} placeholder="Ex: R$ 2.800.000 ou Sob Consulta" />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área Total *</Label>
                <Input id="area" {...register('area')} placeholder="Ex: 280m²" />
                <p className="text-xs text-muted-foreground">Área total do terreno/imóvel</p>
                {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area_usable">Área Útil/Construída</Label>
                <Input 
                  id="area_usable" 
                  type="number" 
                  min="0" 
                  {...register('area_usable', { valueAsNumber: true })} 
                  placeholder="Ex: 220"
                />
                <p className="text-xs text-muted-foreground">Em m² (apenas números)</p>
                {errors.area_usable && <p className="text-sm text-destructive">{errors.area_usable.message}</p>}
              </div>
            </div>

            {/* Preço por m² */}
            {watch('price') && watch('area_usable') && watch('area_usable') > 0 && convertPriceToNumber(watch('price')) > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  💡 Preço por m²: R$ {(convertPriceToNumber(watch('price')) / watch('area_usable')).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Baseado na área útil de {watch('area_usable')} m²
                </p>
              </div>
            )}
          </div>

          {/* Detalhes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Quartos</Label>
              <Input id="bedrooms" type="number" min="0" {...register('bedrooms', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banheiros</Label>
              <Input id="bathrooms" type="number" min="0" {...register('bathrooms', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suites">Suítes</Label>
              <Input id="suites" type="number" min="0" {...register('suites', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking">Vagas</Label>
              <Input id="parking" type="number" min="0" {...register('parking', { valueAsNumber: true })} />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...register('description')} placeholder="Descrição detalhada do imóvel..." rows={4} />
          </div>

          {/* URL do Vídeo YouTube */}
          <div className="space-y-2">
            <Label htmlFor="youtube_video_url">URL do Vídeo YouTube</Label>
            <Input 
              id="youtube_video_url" 
              {...register('youtube_video_url')} 
              placeholder="Ex: https://www.youtube.com/watch?v=ABC123 ou https://youtu.be/ABC123" 
            />
            {errors.youtube_video_url && (
              <p className="text-sm text-destructive">{errors.youtube_video_url.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Adicione um vídeo do YouTube para exibir na página do imóvel (opcional)
            </p>
          </div>

          {/* Características */}
          <div className="space-y-4">
            <Label>Características e Status</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status do Imóvel</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value: 'active' | 'sold' | 'inactive') => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="sold">Vendido</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Status "Ativo" = publicado automaticamente. "Vendido" ou "Inativo" = não publicado.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="is_featured" checked={watch('is_featured')} onCheckedChange={(checked) => setValue('is_featured', checked)} />
                <Label htmlFor="is_featured">Imóvel em destaque</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_exclusive" checked={watch('is_exclusive')} onCheckedChange={(checked) => setValue('is_exclusive', checked)} />
                <Label htmlFor="is_exclusive">Exclusivo</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                O selo "Novo" aparece automaticamente por 30 dias após o cadastro.
              </p>
              <div className="flex items-center space-x-2">
                <Switch id="has_virtual_tour" checked={watch('has_virtual_tour')} onCheckedChange={(checked) => setValue('has_virtual_tour', checked)} />
                <Label htmlFor="has_virtual_tour">Tour virtual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_gated_community" checked={watch('is_gated_community')} onCheckedChange={(checked) => setValue('is_gated_community', checked)} />
                <Label htmlFor="is_gated_community">Condomínio fechado</Label>
              </div>
            </div>
            
            {selectedOwners.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  ℹ️ Este imóvel está vinculado a {selectedOwners.length} proprietário(s)
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {selectedOwners.map(s => s.owner.full_name).join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* Upload de Imagens */}
          <div className="space-y-4">
            <Label>Imagens do Imóvel</Label>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              existingImages={existingImages}
              onExistingImagesChange={setExistingImages}
              imageSettings={existingImageSettings}
              onImageSettingsChange={setExistingImageSettings}
              newImageSettings={newImageSettings}
              onNewImageSettingsChange={setNewImageSettings}
            />
          </div>

          {/* Título - Movido para o final */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="title">Título *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={generateTitleSuggestion}
              >
                <Wand2 className="h-4 w-4" />
                Sugerir Título
              </Button>
            </div>
            <Input 
              id="title" 
              {...register('title')} 
              placeholder="Ex: Sobrado com 3 dormitórios à venda, 150m² por R$ 850.000 - Jardim das Flores - São Paulo/SP" 
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            <p className="text-xs text-muted-foreground">
              O título é gerado automaticamente baseado nas informações do imóvel. Você pode editá-lo conforme necessário.
            </p>
          </div>

          {/* Seção interna de Proprietários (apenas admin) */}
          <PropertyOwnersSection
            selectedOwners={selectedOwners}
            setSelectedOwners={setSelectedOwners}
            isVisible={Boolean(isAdmin)}
          />

          {/* Ações */}
          <div className="flex justify-between space-x-4 pt-6">
            <div>
              {property && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      className="gap-2"
                      disabled={loading || deleting}
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir Imóvel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão permanente</AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="space-y-2">
                          <p className="font-medium text-destructive">⚠️ Esta ação é irreversível!</p>
                          <p>O imóvel <strong>{property.title}</strong> (código: {property.code}) será permanentemente excluído do banco de dados, incluindo:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Todas as informações do imóvel</li>
                            <li>Todas as imagens associadas</li>
                            <li>Vínculos com proprietários</li>
                            <li>Histórico de visualizações</li>
                          </ul>
                          <p className="text-sm font-medium">Não será possível recuperar estes dados após a exclusão.</p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deleting}
                      >
                        {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Excluir Permanentemente
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading || deleting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || deleting}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {property ? 'Atualizar' : 'Salvar'} Imóvel
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
