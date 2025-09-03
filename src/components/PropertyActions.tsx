import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Phone, Mail, Video, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertyActionsProps {
  propertyTitle: string;
  propertyUrl?: string;
  virtualTour?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function PropertyActions({ 
  propertyTitle, 
  propertyUrl, 
  virtualTour,
  isFavorite = false,
  onToggleFavorite 
}: PropertyActionsProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const { toast } = useToast();

  const handleToggleFavorite = () => {
    setFavorite(!favorite);
    onToggleFavorite?.();
    toast({
      description: favorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
    });
  };

  const handleShare = async () => {
    const url = propertyUrl || window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          url: url,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          description: "Link copiado para a área de transferência",
        });
      } catch (err) {
        toast({
          description: "Erro ao copiar o link",
          variant: "destructive",
        });
      }
    }
  };

  const handleCall = () => {
    window.open('tel:+5512997635380', '_self');
  };

  const handleEmail = () => {
    window.open('mailto:contato@teomiprime.com', '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${propertyTitle}`);
    window.open(`https://wa.me/5512997635380?text=${message}`, '_blank');
  };

  const handleVirtualTour = () => {
    if (virtualTour) {
      window.open(virtualTour, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={handleWhatsApp}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
        <Button onClick={handleCall} variant="outline">
          <Phone className="h-4 w-4" />
          Ligar
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleEmail} variant="outline">
          <Mail className="h-4 w-4" />
          E-mail
        </Button>
        {virtualTour && (
          <Button onClick={handleVirtualTour} variant="gold">
            <Video className="h-4 w-4" />
            Tour Virtual
          </Button>
        )}
      </div>

      {/* Utility Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          onClick={handleToggleFavorite}
          variant="ghost"
          size="sm"
          className="flex-1"
        >
          <Heart className={`h-4 w-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
          {favorite ? 'Favorito' : 'Favoritar'}
        </Button>
        <Button
          onClick={handleShare}
          variant="ghost"
          size="sm"
          className="flex-1"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
}