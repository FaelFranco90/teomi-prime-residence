import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadResult {
  url: string;
  path: string;
}

type UploadProgressMap = Record<string, number>;

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgressMap>({});
  const { toast } = useToast();

  const uploadImage = async (file: File, propertyId: string, index: number): Promise<UploadResult | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${propertyId}_${Date.now()}_${index}.${fileExt}`;
      const filePath = `imoveis/${propertyId}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const uploadMultipleImages = async (files: File[], propertyId: string): Promise<UploadResult[]> => {
    setUploading(true);
    const results: UploadResult[] = [];

    try {
      // reset progress
      const initialProgress: UploadProgressMap = {};
      files.forEach((f) => (initialProgress[f.name] = 0));
      setProgress(initialProgress);

      const uploadPromises = files.map(async (file, index) => {
        // Simulate progress up to 90% while uploading
        let current = 0;
        const interval = setInterval(() => {
          current = Math.min(90, current + Math.floor(Math.random() * 10));
          setProgress((prev) => ({ ...prev, [file.name]: current }));
        }, 200);

        const single = await uploadImage(file, propertyId, index);
        clearInterval(interval);

        if (single) {
          setProgress((prev) => ({ ...prev, [file.name]: 100 }));
          return single;
        } else {
          setProgress((prev) => ({ ...prev, [file.name]: 0 }));
          return null;
        }
      });

      const uploadResults = await Promise.all(uploadPromises);

      for (const result of uploadResults) {
        if (result) results.push(result);
      }

      if (results.length !== files.length) {
        toast({
          title: "Aviso",
          description: `${files.length - results.length} imagem(s) não puderam ser enviadas.`,
          variant: "destructive",
        });
      }

      return results;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar as imagens. Tente novamente.",
        variant: "destructive",
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imagePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('property-images')
        .remove([imagePath]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a imagem.",
        variant: "destructive",
      });
      return false;
    }
  };

  const saveImageRecords = async (propertyId: string, uploadResults: UploadResult[], imageSettings: any[] = []): Promise<boolean> => {
    try {
      const imageRecords = uploadResults.map((result, index) => {
        const setting = imageSettings[index];
        return {
          property_id: propertyId,
          image_url: result.url,
          is_primary: setting?.isPrimary || index === 0,
          is_public: setting?.isPublic !== undefined ? setting.isPublic : true,
          order_index: index,
        };
      });

      const { error } = await supabase
        .from('property_images')
        .insert(imageRecords);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error saving image records:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os registros das imagens.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateImageOrder = async (propertyId: string, imageUrlsInOrder: string[]): Promise<boolean> => {
    try {
      const updates = imageUrlsInOrder.map((url, idx) =>
        supabase.from('property_images')
          .update({ order_index: idx + 1 })
          .eq('property_id', propertyId)
          .eq('image_url', url)
      );
      const results = await Promise.all(updates);
      const anyError = results.find(r => (r as any).error);
      if (anyError) throw (anyError as any).error;
      return true;
    } catch (error) {
      console.error('Error updating image order:', error);
      toast({ title: 'Erro ao reordenar', description: 'Tente novamente.', variant: 'destructive' });
      return false;
    }
  };

  const setPrimaryImage = async (propertyId: string, imageUrl: string): Promise<boolean> => {
    try {
      // reset all to false
      const { error: resetErr } = await supabase
        .from('property_images')
        .update({ is_primary: false })
        .eq('property_id', propertyId);
      if (resetErr) throw resetErr;

      const { error: setErr } = await supabase
        .from('property_images')
        .update({ is_primary: true })
        .eq('property_id', propertyId)
        .eq('image_url', imageUrl);
      if (setErr) throw setErr;
      return true;
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast({ title: 'Erro ao definir principal', description: 'Tente novamente.', variant: 'destructive' });
      return false;
    }
  };

  const ensurePrimaryImage = async (propertyId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('id, image_url, order_index, is_primary')
        .eq('property_id', propertyId);
      if (error) throw error;
      const hasPrimary = (data || []).some((d: any) => d.is_primary);
      if (!hasPrimary && data && data.length > 0) {
        const first = [...data].sort((a, b) => a.order_index - b.order_index)[0];
        await supabase
          .from('property_images')
          .update({ is_primary: true })
          .eq('property_id', propertyId)
          .eq('id', first.id);
      }
    } catch (error) {
      console.error('Error ensuring primary image:', error);
    }
  };

  return {
    uploading,
    progress,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    saveImageRecords,
    updateImageOrder,
    setPrimaryImage,
    ensurePrimaryImage,
  };
}