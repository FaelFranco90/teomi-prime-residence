import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Bed, 
  Bath, 
  Car, 
  Square, 
  MapPin, 
  Play, 
  Shield, 
  Phone,
  Mail,
  MessageCircle,
  Video,
  Images
} from "lucide-react";
import { useSupabaseProperties, Property } from "@/hooks/useSupabaseProperties";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { ImageLightbox } from "@/components/ImageLightbox";
import { PropertyGalleryMosaic } from "@/components/PropertyGalleryMosaic";
import { PropertySpecsBar } from "@/components/PropertySpecsBar";
import { PropertyActions } from "@/components/PropertyActions";


export default function PropertyDetail() {
  const { code } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const { getPropertyByCode, getPropertyById } = useSupabaseProperties();

  useEffect(() => {
    let active = true;

    const fetchProperty = async () => {
      if (!code) return;
      
      try {
        setLoading(true);
        console.log('PropertyDetail: fetching by code param', code);
        
        let propertyData = await getPropertyByCode(code);
        
        if (!active) return;
        
        const looksLikeUUID = /^[0-9a-fA-F-]{36}$/.test(code);
        if (!propertyData && looksLikeUUID) {
          console.log('PropertyDetail: not found by code, trying by id');
          propertyData = await getPropertyById(code);
        }
        
        if (active) {
          setProperty(propertyData);
        }
      } catch (err) {
        console.error('PropertyDetail: failed to load property', err);
        if (active) {
          setProperty(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProperty();
    
    return () => {
      active = false;
    };
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando imóvel...</h1>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
          <Link to="/imoveis">
            <Button variant="outline">Voltar para Imóveis</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // In a real app, this would send the form data to an API
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/imoveis">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Imóveis
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Property Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {property.isNew && (
                <Badge className="bg-green-600 text-white">Novo</Badge>
              )}
              {property.featured && (
                <Badge className="bg-accent text-accent-foreground">Destaque</Badge>
              )}
              {property.exclusive && (
                <Badge variant="outline" className="border-accent text-accent">
                  Exclusivo
                </Badge>
              )}
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              {property.title || 'Imóvel'}
            </h1>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{property.location || 'Localização não informada'}</span>
            </div>
            
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <p className="font-serif text-2xl md:text-3xl font-bold text-accent">
                {property.price || 'Sob consulta'}
              </p>
              <p className="text-muted-foreground">
                Código: {property.code || '—'}
              </p>
            </div>
          </div>

          {/* Gallery Mosaic */}
          {property.images && property.images.length > 0 && (
            <div className="mb-8">
              {property.images.length === 1 ? (
                <ImageLightbox
                  images={property.images}
                  initialIndex={0}
                  trigger={
                    <div className="relative h-80 cursor-pointer overflow-hidden rounded-lg group">
                      <img
                        src={property.images[0]}
                        alt={property.title || 'Imóvel'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                        <Images className="h-4 w-4" />
                        Ver fotos
                      </div>
                    </div>
                  }
                />
              ) : (
                <PropertyGalleryMosaic 
                  images={property.images} 
                  title={property.title || 'Imóvel'} 
                />
              )}
            </div>
          )}

          {/* Specs Bar */}
          <PropertySpecsBar
            area={property.area}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            parking={property.parking}
            price={property.price}
          />
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Specs */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold mb-6">Especificações</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <Square className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p className="text-2xl font-bold">{property.area || '—'}</p>
                      <p className="text-muted-foreground">Área Total</p>
                    </div>
                    <div className="text-center">
                      <Bed className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p className="text-2xl font-bold">{property.bedrooms ?? 0}</p>
                      <p className="text-muted-foreground">Dormitórios</p>
                    </div>
                    <div className="text-center">
                      <Bath className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p className="text-2xl font-bold">{property.bathrooms ?? 0}</p>
                      <p className="text-muted-foreground">Banheiros</p>
                    </div>
                    <div className="text-center">
                      <Car className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p className="text-2xl font-bold">{property.parking ?? 0}</p>
                      <p className="text-muted-foreground">Vagas</p>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Suítes:</span>
                      <span className="font-semibold">{property.suites ?? 0}</span>
                    </div>
                    {property.virtualTour && (
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-accent" />
                        <span className="text-sm">Tour Virtual Disponível</span>
                      </div>
                    )}
                    {property.gatedCommunity && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-accent" />
                        <span className="text-sm">Condomínio Fechado</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Video Section */}
              {property.youtubeVideoUrl && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Video className="h-6 w-6 text-accent" />
                      <h2 className="font-serif text-2xl font-bold">Vídeo do Imóvel</h2>
                    </div>
                    <YouTubeEmbed url={property.youtubeVideoUrl} title={`Vídeo - ${property.title}`} />
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold mb-4">Descrição</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Este magnífico imóvel oferece uma experiência de vida única com acabamentos de primeira qualidade. 
                    Localizado em uma das melhores regiões, combina sofisticação, conforto e praticidade em um ambiente exclusivo.
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold mb-4">Características</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.gatedCommunity && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        <span className="text-sm">Condomínio fechado</span>
                      </div>
                    )}
                    {property.virtualTour && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        <span className="text-sm">Tour virtual disponível</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm">Segurança 24h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm">Área de lazer completa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm">Acabamentos de luxo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm">Localização privilegiada</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Contact Panel */}
            <div className="space-y-6">
              <Card className="sticky top-6 shadow-luxury">
                <CardContent className="p-6">
                  {/* Price Display */}
                  <div className="text-center mb-6 p-4 bg-accent/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Preço</p>
                    <p className="font-serif text-2xl font-bold text-accent">
                      {property.price || 'Sob consulta'}
                    </p>
                  </div>

                  {/* Contact Actions */}
                  <PropertyActions
                    propertyTitle={property.title || 'Imóvel'}
                    virtualTour={property.virtualTour ? property.youtubeVideoUrl : undefined}
                  />
                  
                  {/* Contact Form */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-semibold mb-4">Ou envie uma mensagem</h3>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <Input
                          placeholder="Seu nome"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Seu e-mail"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="tel"
                          placeholder="Seu telefone"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Textarea
                          placeholder="Mensagem (opcional)"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                          className="min-h-[80px] text-sm"
                        />
                      </div>
                      
                      <Button type="submit" variant="luxury" className="w-full">
                        Enviar Mensagem
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-luxury bg-green-600 hover:bg-green-700 z-50"
        onClick={() => window.open('https://wa.me/5512999999999', '_blank')}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
}