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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/hooks/useSupabaseProperties';
import { ImageUpload } from './ImageUpload';
import { Loader2, Wand2 } from 'lucide-react';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';

const propertySchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  location: z.string().min(1, 'Localização é obrigatória'),
  price: z.string().min(1, 'Preço é obrigatório'),
  area: z.string().min(1, 'Área é obrigatória'),
  property_type: z.string().min(1, 'Tipo é obrigatório'),
  description: z.string().optional(),
  bedrooms: z.number().min(0).default(0),
  bathrooms: z.number().min(0).default(0),
  suites: z.number().min(0).default(0),
  parking: z.number().min(0).default(0),
  is_featured: z.boolean().default(false),
  is_exclusive: z.boolean().default(false),
  is_new: z.boolean().default(false),
  has_virtual_tour: z.boolean().default(false),
  is_gated_community: z.boolean().default(false),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  property?: Property;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(property?.images || []);
  const { toast } = useToast();
  const { types, loading: typesLoading } = usePropertyTypes();
  const [previewCode, setPreviewCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property ? {
      code: property.code,
      title: property.title,
      location: property.location,
      price: property.price,
      area: property.area,
      property_type: property.propertyType || '',
      description: '',
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      suites: property.suites,
      parking: property.parking,
      is_featured: property.featured || false,
      is_exclusive: property.exclusive || false,
      is_new: property.isNew || false,
      has_virtual_tour: property.virtualTour || false,
      is_gated_community: property.gatedCommunity || false,
    } : {
      bedrooms: 0,
      bathrooms: 0,
      suites: 0,
      parking: 0,
      is_featured: false,
      is_exclusive: false,
      is_new: false,
      has_virtual_tour: false,
      is_gated_community: false,
    }
  });

  const selectedType = watch('property_type');
  const currentCode = watch('code');

  const convertPriceToNumber = (priceStr: string): number => {
    if (priceStr === "Sob Consulta") return 0;
    return parseInt(priceStr.replace(/[^\d]/g, ''));
  };

  const convertAreaToNumber = (areaStr: string): number => {
    return parseInt(areaStr.replace(/[^\d]/g, ''));
  };

  const fetchPreviewCode = async (typeKeyOrLabel: string) => {
    if (!typeKeyOrLabel) {
      setPreviewCode(null);
      return;
    }
    const { data, error } = await supabase.rpc('preview_next_property_code', { _property_type: typeKeyOrLabel });
    if (error) {
      console.error('Erro ao pré-visualizar código:', error);
      setPreviewCode(null);
      return;
    }
    setPreviewCode(data ?? null);

    // Se for criação e o campo código estiver vazio, preenche automaticamente
    if (!property && !currentCode && data) {
      setValue('code', data);
    }
  };

  useEffect(() => {
    if (selectedType) {
      fetchPreviewCode(selectedType);
    } else {
      setPreviewCode(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);
    try {
      // Validação de duplicidade de código (amigável)
      const { data: existing, error: existingErr } = await supabase
        .from('properties')
        .select('id')
        .eq('code', data.code)
        .maybeSingle();

      if (existingErr && existingErr.code !== 'PGRST116') {
        // PGRST116 => No rows found for maybeSingle; ignoramos
        throw existingErr;
      }

      if (existing && (!property || existing.id !== property.id)) {
        toast({
          title: 'Código já existe',
          description: `O código ${data.code} já está em uso. Escolha outro.`,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const propertyData = {
        code: data.code,
        title: data.title,
        location: data.location,
        price: data.price,
        area: data.area,
        property_type: data.property_type,
        description: data.description,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        suites: data.suites,
        parking: data.parking,
        is_featured: data.is_featured,
        is_exclusive: data.is_exclusive,
        is_new: data.is_new,
        has_virtual_tour: data.has_virtual_tour,
        is_gated_community: data.is_gated_community,
        price_number: convertPriceToNumber(data.price),
        area_number: convertAreaToNumber(data.area),
      };

      let propertyId: string;

      if (property) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id);

        if (error) throw error;
        propertyId = property.id;
      } else {
        // Create new property (gatilho no banco definirá code se vier vazio)
        const { data: newProperty, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();

        if (error) throw error;
        propertyId = newProperty.id;
      }

      // Handle image uploads if there are new images
      if (images.length > 0) {
        await handleImageUploads(propertyId);
      }

      toast({
        title: property ? "Imóvel atualizado" : "Imóvel criado",
        description: property ? "As alterações foram salvas com sucesso." : "O novo imóvel foi cadastrado com sucesso.",
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o imóvel. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploads = async (propertyId: string) => {
    const uploadPromises = images.map(async (image, index) => {
      const fileName = `${propertyId}_${Date.now()}_${index}.${image.name.split('.').pop()}`;
      const filePath = `imoveis/${propertyId}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('property-images').upload(filePath, image);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(filePath);
      const { error: dbError } = await supabase.from('property_images').insert({
        property_id: propertyId,
        image_url: publicUrl,
        is_primary: index === 0,
        order_index: index,
      });
      if (dbError) throw dbError;
    });
    await Promise.all(uploadPromises);
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  {...register('code')}
                  placeholder="Ex: CA0001"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    if (selectedType && previewCode) {
                      setValue('code', previewCode);
                      toast({ title: 'Código sugerido aplicado', description: previewCode });
                    } else if (!selectedType) {
                      toast({ title: 'Selecione um tipo', description: 'Escolha o tipo para sugerir o código.', variant: 'destructive' });
                    } else {
                      toast({ title: 'Nenhuma sugestão disponível', description: 'Não foi possível obter uma sugestão.' });
                    }
                  }}
                >
                  <Wand2 className="h-4 w-4" />
                  Sugerir
                </Button>
              </div>
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
              {selectedType && previewCode && (
                <p className="text-xs text-muted-foreground">Próximo código sugerido para "{selectedType}": {previewCode}</p>
              )}
            </div>

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
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" {...register('title')} placeholder="Ex: Penthouse Exclusivo Vista Panorâmica" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          {/* Localização */}
          <div className="space-y-2">
            <Label htmlFor="location">Localização *</Label>
            <Input id="location" {...register('location')} placeholder="Ex: Alphaville, São José dos Campos" />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          {/* Preço e Área */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço *</Label>
              <Input id="price" {...register('price')} placeholder="Ex: R$ 2.800.000 ou Sob Consulta" />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área *</Label>
              <Input id="area" {...register('area')} placeholder="Ex: 280m²" />
              {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
            </div>
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

          {/* Características */}
          <div className="space-y-4">
            <Label>Características</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Upload de Imagens */}
          <div className="space-y-4">
            <Label>Imagens do Imóvel</Label>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              existingImages={existingImages}
              onExistingImagesChange={setExistingImages}
            />
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {property ? 'Atualizar' : 'Salvar'} Imóvel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
