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
  code: z.string().optional(),
  title: z.string().min(1, 'Título é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  neighborhood: z.string().optional(),
  condo_name: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  cep: z.string().optional(),
  price: z.string().min(1, 'Preço é obrigatório'),
  area: z.string().min(1, 'Área é obrigatória'),
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
      city: property.city || '',
      neighborhood: property.neighborhood || '',
      condo_name: property.condoName || '',
      address: property.address || '',
      state: property.state || '',
      cep: property.cep || '',
      price: property.price,
      area: property.area,
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
      is_published: true, // All existing properties are published by default
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
      is_published: true,
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
      // Checagem de duplicidade só quando o usuário informou um código manualmente
      if (data.code && data.code.trim() !== '') {
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
      }

      const propertyData = {
        code: data.code ?? '', // Se vier vazio, o trigger gera automaticamente
        title: data.title,
        city: data.city,
        neighborhood: data.neighborhood || null,
        condo_name: data.condo_name || null,
        address: data.address || null,
        state: data.state || null,
        cep: data.cep || null,
        location: [data.condo_name, data.neighborhood, data.city].filter(Boolean).join(', '), // Maintain compatibility
        price: data.price,
        area: data.area,
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
              <Label htmlFor="code">Código</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  {...register('code')}
                  placeholder={property ? 'Código do imóvel' : 'Gerado automaticamente ao salvar'}
                  disabled={!property} // Desabilitado na criação (gerado via trigger)
                />
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    if (selectedType && previewCode) {
                      if (property) {
                        // No modo edição, permitir aplicar a sugestão ao campo (se realmente quiser)
                        setValue('code', previewCode);
                        toast({ title: 'Código sugerido aplicado', description: previewCode });
                      } else {
                        // Na criação, apenas mostrar a sugestão sem modificar o campo
                        toast({ title: 'Próximo código sugerido', description: previewCode });
                      }
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
              <div className="flex items-center space-x-2">
                <Switch id="is_published" checked={watch('is_published')} onCheckedChange={(checked) => setValue('is_published', checked)} />
                <Label htmlFor="is_published">Publicado no site</Label>
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
