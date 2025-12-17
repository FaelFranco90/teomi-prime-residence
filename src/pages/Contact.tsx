
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_CONFIG, getWhatsAppURL } from "@/config/contact";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://n8n.rafaelfcunha.com.br/webhook/lead-prime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve com total discrição.",
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Erro ao enviar contato:', error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um problema ao enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-luxury-dark text-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Fale <span className="text-accent">Conosco</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Atendimento exclusivo e confidencial para sua tranquilidade
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-luxury">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    Envie sua Mensagem
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Todas as informações são tratadas com absoluta confidencialidade
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="(12) 99999-9999"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="seu@email.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Descreva como podemos ajudá-lo..."
                        rows={6}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="luxury" type="submit" className="flex-1">
                        Enviar Mensagem
                      </Button>
                      <Button 
                        variant="gold" 
                        type="button"
                        className="flex-1 gap-2"
                        onClick={() => window.open(getWhatsAppURL(), '_blank')}
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp Direto
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="shadow-luxury">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-full">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Telefone/WhatsApp</h4>
                      <p className="text-muted-foreground">{CONTACT_CONFIG.PHONE_DISPLAY}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-full">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">E-mail</h4>
                      <p className="text-muted-foreground">{CONTACT_CONFIG.EMAIL}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-full">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Endereço</h4>
                      <p className="text-muted-foreground">
                        {CONTACT_CONFIG.ADDRESS.split('\n').map((line, i) => (
                          <span key={i}>
                            {line}
                            {i === 0 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-full">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Horário de Atendimento</h4>
                      <p className="text-muted-foreground">
                        Segunda à Sexta: 9h às 18h<br />
                        Sábado: 9h às 14h<br />
                        Domingo: Sob agendamento
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-luxury bg-luxury-dark text-background">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold mb-3">
                    Atendimento Exclusivo
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    Reuniões presenciais em ambiente reservado e confortável, 
                    garantindo total privacidade em suas negociações.
                  </p>
                  <Button variant="gold" className="w-full">
                    Agendar Reunião
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Nossa Localização</h2>
            <p className="text-muted-foreground">Localização privilegiada em Taubaté</p>
          </div>
          
          <Card className="overflow-hidden shadow-luxury">
            <div className="h-96 bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Mapa interativo será carregado aqui<br />
                  <span className="text-sm">Avenida Independência, 70 - Taubaté-SP</span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
