import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Users, Award, CheckCircle, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-luxury-home.jpg";

const values = [
  {
    icon: Shield,
    title: "Confidencialidade Total",
    description: "Privacidade e discrição absoluta em cada negociação, protegendo informações sensíveis de nossos clientes."
  },
  {
    icon: Eye,
    title: "Atendimento Reservado", 
    description: "Ambientes exclusivos preparados para preservar o conforto e tranquilidade em todas as reuniões."
  },
  {
    icon: Users,
    title: "Equipe Especializada",
    description: "Profissionais altamente qualificados e especializados no mercado de imóveis de luxo."
  },
  {
    icon: Award,
    title: "Segurança Jurídica",
    description: "Assessoria completa com toda estrutura necessária para garantir proteção em todas as etapas."
  },
];

const differentials = [
  "Consultoria estratégica para investimentos seguros e valorizados",
  "Portfólio exclusivo de imóveis raros e sofisticados", 
  "Atendimento personalizado com foco no perfil de cada cliente",
  "Negociações conduzidas com máxima discrição e profissionalismo",
  "Assessoria jurídica completa em todas as transações",
  "Ambientes preparados para reuniões reservadas e confortáveis"
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Luxury Office Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center text-background max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Sobre a <span className="text-accent">Teomi Prime</span>
          </h1>
          <p className="text-xl md:text-2xl">
            Exclusividade, Confiança e Discrição no Mercado de Altíssimo Padrão
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Na Teomi Prime, acreditamos que negócios extraordinários exigem mais do que competência: 
              exigem discrição absoluta, atendimento personalizado e total segurança para todas as partes envolvidas.
            </p>

            <p className="mb-8">
              Somos especialistas na intermediação de imóveis de alto luxo, com foco em clientes que buscam 
              privacidade e confidencialidade em cada negociação, consultoria estratégica para investimentos 
              seguros e valorizados, e ambientes exclusivos para atendimentos reservados e confortáveis.
            </p>

            <p className="mb-8">
              Cada cliente é único. Por isso, cada atendimento é conduzido com a máxima atenção e reserva. 
              Nossas negociações acontecem em ambientes preparados para preservar o conforto e a tranquilidade, 
              com toda a estrutura necessária para garantir segurança jurídica e proteção de informações sensíveis.
            </p>

            <p className="mb-12">
              Atuamos na captação e venda de residências, coberturas, condomínios fechados e empreendimentos 
              comerciais de altíssimo padrão. Nosso portfólio é composto por imóveis raros e exclusivos, 
              sempre alinhados ao perfil sofisticado de nossos clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Nossos Valores
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Os pilares que fundamentam nossa excelência no atendimento
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                    <value.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Por que escolher a Teomi Prime
              </h2>
              <div className="space-y-4">
                {differentials.map((differential, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{differential}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Button variant="luxury" size="lg" className="gap-2">
                  Agendar Atendimento <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Ver Imóveis
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Luxury Real Estate"
                className="rounded-lg shadow-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-luxury-dark text-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Seja bem atendido. Com discrição. Com segurança. Com excelência.
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Entre em contato conosco e descubra como podemos ajudá-lo a encontrar 
            o imóvel perfeito com total confidencialidade e profissionalismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg" className="text-lg px-8 py-6">
              Entrar em Contato
            </Button>
            <Button variant="elegant" size="lg" className="text-lg px-8 py-6 bg-background/20 hover:bg-background/30 text-background border-background">
              Ver Portfólio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}