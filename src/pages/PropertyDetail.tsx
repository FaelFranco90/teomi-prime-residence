import { useState } from "react";
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
  ChevronLeft, 
  ChevronRight,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

// Mock property data (in a real app, this would come from an API)
const propertyData = {
  "1": {
    id: "1",
    code: "TP001",
    title: "Penthouse Exclusivo Vista Panorâmica",
    location: "Alphaville, São José dos Campos",
    price: "R$ 2.800.000",
    area: "280m²",
    bedrooms: 4,
    bathrooms: 5,
    suites: 3,
    parking: 3,
    images: [property1, property2, property3],
    featured: true,
    exclusive: true,
    virtualTour: true,
    gatedCommunity: true,
    isNew: false,
    description: "Penthouse exclusivo com vista panorâmica da cidade. Este imóvel de altíssimo padrão oferece acabamentos de primeira linha, amplos espaços integrados e terraço gourmet com piscina privativa. Localizado no coração do Alphaville, oferece total privacidade e segurança.",
    features: [
      "Piscina privativa no terraço",
      "Churrasqueira gourmet",
      "Home theater",
      "Adega climatizada",
      "Aquecimento central",
      "Sistema de som ambiente",
      "Elevador privativo",
      "3 vagas cobertas",
      "Depósito privativo",
      "Vista panorâmica"
    ]
  }
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const property = propertyData[id as keyof typeof propertyData];

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

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

      {/* Image Gallery */}
      <section className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img 
            src={property.images[currentImageIndex]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="lg"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-background"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-background"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Property Info Overlay */}
          <div className="absolute bottom-6 left-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {property.isNew && (
                <Badge className="bg-green-600 text-white">Novo</Badge>
              )}
              {property.featured && (
                <Badge className="bg-accent text-accent-foreground">Destaque</Badge>
              )}
              {property.exclusive && (
                <Badge variant="outline" className="bg-background/90 text-foreground border-accent">
                  Exclusivo
                </Badge>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-background mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-background/90 mb-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{property.location}</span>
            </div>
            <p className="font-serif text-2xl font-bold text-background">
              {property.price}
            </p>
            <p className="text-background/80 font-medium">
              Código: {property.code}
            </p>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-6 right-6 bg-background/20 rounded-lg px-3 py-1">
            <span className="text-background text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </span>
          </div>
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
                      <p className="text-2xl font-bold">{property.area}</p>
                      <p className="text-muted-foreground">Área Total</p>
                    </div>
                    <div className="text-center">
                      <Bed className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p className="text-2xl font-bold">{property.bedrooms}</p>
                      <p className="text-muted-foreground">Dormitórios</p>
                    </div>
                    <div className="text-center">
                      <Bath className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p className="text-2xl font-bold">{property.bathrooms}</p>
                      <p className="text-muted-foreground">Banheiros</p>
                    </div>
                    <div className="text-center">
                      <Car className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p className="text-2xl font-bold">{property.parking}</p>
                      <p className="text-muted-foreground">Vagas</p>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Suítes:</span>
                      <span className="font-semibold">{property.suites}</span>
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

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold mb-4">Descrição</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold mb-4">Características</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold mb-6">Interesse neste Imóvel?</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button type="submit" variant="luxury" className="w-full">
                      Solicitar Informações
                    </Button>
                  </form>

                  <div className="space-y-3 mt-6 pt-6 border-t border-border">
                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="h-4 w-4" />
                      (12) 99999-9999
                    </Button>
                    
                    <Button variant="outline" className="w-full gap-2">
                      <Mail className="h-4 w-4" />
                      contato@teomiprime.com
                    </Button>
                    
                    {property.virtualTour && (
                      <Button variant="gold" className="w-full gap-2">
                        <Play className="h-4 w-4" />
                        Tour Virtual
                      </Button>
                    )}
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