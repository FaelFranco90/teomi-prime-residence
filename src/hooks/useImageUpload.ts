import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadResult {
  url: string;
  path: string;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
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
      const uploadPromises = files.map((file, index) => 
        uploadImage(file, propertyId, index)
      );

      const uploadResults = await Promise.all(uploadPromises);
      
      for (const result of uploadResults) {
        if (result) {
          results.push(result);
        }
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

  const saveImageRecords = async (propertyId: string, uploadResults: UploadResult[]): Promise<boolean> => {
    try {
      const imageRecords = uploadResults.map((result, index) => ({
        property_id: propertyId,
        image_url: result.url,
        is_primary: index === 0,
        order_index: index,
      }));

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

  return {
    uploading,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    saveImageRecords,
  };
}