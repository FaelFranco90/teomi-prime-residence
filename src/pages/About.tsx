
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Users, Award, CheckCircle, ArrowRight, Calendar, MessageCircle, TrendingUp, Star, Globe, Clock, Phone, Mail } from "lucide-react";
import heroImage from "@/assets/hero-luxury-home.jpg";

const methodology = [
  {
    step: "01",
    title: "Análise Patrimonial",
    description: "Avaliação completa do perfil de investimento e objetivos estratégicos"
  },
  {
    step: "02", 
    title: "Curadoria Exclusiva",
    description: "Seleção de imóveis únicos do nosso portfólio off-market premium"
  },
  {
    step: "03",
    title: "Due Diligence",
    description: "Verificação jurídica completa e análise de potencial de valorização"
  },
  {
    step: "04",
    title: "Negociação Blindada",
    description: "Condução sigilosa com estratégia personalizada para máximo resultado"
  },
  {
    step: "05",
    title: "Entrega White-Glove",
    description: "Acompanhamento completo até a posse com serviços concierge"
  }
];

const testimonials = [
  {
    initials: "A.S.",
    role: "CEO, Setor Financeiro",
    text: "Profissionalismo excepcional. A discrição e expertise foram fundamentais para nossa transação de R$ 15 milhões.",
    rating: 5
  },
  {
    initials: "M.R.",
    role: "Empresário, Agronegócio", 
    text: "Encontraram em 30 dias o que procurava há 2 anos. O atendimento personalizado fez toda diferença.",
    rating: 5
  },
  {
    initials: "L.F.",
    role: "Investidor Internacional",
    text: "Assessoria impecável do início ao fim. Superaram minhas expectativas em todos os aspectos.",
    rating: 5
  }
];

const stats = [
  { number: "R$ 250Mi+", label: "Negociados Discretamente" },
  { number: "98%", label: "Taxa de Satisfação" },
  { number: "45 dias", label: "Tempo Médio de Venda" },
  { number: "Premium", label: "Atendimento Exclusivo" }
];

const benefits = [
  {
    icon: Globe,
    title: "Imóveis Publicados e Reservados",
    description: "Trabalhamos com imóveis publicados e também opções reservadas, acessíveis apenas mediante análise prévia do perfil e objetivos do comprador"
  },
  {
    icon: TrendingUp,
    title: "ROI Otimizado",
    description: "Média de 18% de retorno superior ao mercado tradicional"
  },
  {
    icon: Shield,
    title: "Blindagem Jurídica",
    description: "Estrutura legal completa para máxima proteção patrimonial"
  },
  {
    icon: Clock,
    title: "Velocidade Premium",
    description: "Fechamento 70% mais rápido que o mercado convencional"
  }
];

const successCases = [
  {
    type: "Penthouse Histórico",
    location: "Jardins, São Paulo",
    result: "Vendido 22% acima da avaliação inicial",
    timeframe: "35 dias"
  },
  {
    type: "Mansão Contemporânea", 
    location: "Alto da Boa Vista, RJ",
    result: "Negociação sigilosa bem-sucedida",
    timeframe: "28 dias"
  },
  {
    type: "Cobertura de Colecionador",
    location: "Vila Nova Conceição, SP", 
    result: "Valorização de 15% durante processo",
    timeframe: "42 dias"
  }
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Premium */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Luxury Real Estate Experience"
            className="w-full h-full object-cover scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 text-center text-background max-w-6xl mx-auto px-6">
          <div className="mb-6 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-accent/20 text-accent text-sm font-medium rounded-full backdrop-blur-sm">
              Exclusivo para Patrimônios Acima de R$ 5 Milhões
            </span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-7xl font-bold mb-6 animate-fade-in">
            Experiência Exclusiva no<br />
            <span className="text-accent">Mercado de Ultra Luxo</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90 animate-fade-in">
            Para clientes que exigem mais que excelência: exigem exclusividade absoluta, 
            discrição total e resultados extraordinários
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Button variant="gold" size="lg" className="text-lg px-8 py-6 gap-3 hover:scale-105 transition-all">
              <Calendar className="h-5 w-5" />
              Agendar Consultoria Exclusiva
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-background/10 hover:bg-background/20 text-background border-background/30">
              Baixar Relatório Premium
            </Button>
          </div>
          
          <div className="text-sm opacity-75 animate-fade-in">
            <span className="bg-accent/10 px-3 py-1 rounded-full backdrop-blur-sm">
              ✨ Mais de R$ 250 milhões negociados discretamente
            </span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-luxury-dark text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-3xl md:text-4xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm opacity-75">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Confiança de Clientes VIP
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Depoimentos reais de clientes que experimentaram nossa excelência
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-accent fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.initials}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              O Método <span className="text-accent">Teomi Prime</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Processo exclusivo desenvolvido para atender as necessidades mais sofisticadas do mercado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {methodology.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-luxury rounded-full flex items-center justify-center text-background font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  {index < methodology.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-accent to-transparent" />
                  )}
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-luxury-dark text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Por que Ultra-High-Net-Worth escolhem a Teomi
            </h2>
            <p className="opacity-90 max-w-2xl mx-auto">
              Diferenciadores únicos que posicionam nossos clientes à frente do mercado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-background/10 border-background/20 text-background hover:bg-background/20 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/20 rounded-full mb-4">
                    <benefit.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm opacity-75">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Portfolio */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Galeria de Exclusividade
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cases de sucesso que demonstram nossa capacidade de entregar resultados extraordinários
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successCases.map((case_, index) => (
              <Card key={index} className="hover:shadow-luxury transition-all duration-300">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">{case_.type}</CardTitle>
                  <p className="text-muted-foreground">{case_.location}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Resultado:</span>
                      <span className="text-sm text-accent">{case_.result}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Prazo:</span>
                      <span className="text-sm">{case_.timeframe}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Atendimento e Posicionamento Comercial */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Exclusividade no Atendimento. <span className="text-accent">Visibilidade com Inteligência.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Atendimento sob medida para grandes patrimônios, com foco em resultados e respeito ao tempo do cliente.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="border-accent/20 hover:shadow-luxury transition-all duration-300">
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-center mb-8">
                  Na Teomi Prime, valorizamos a privacidade e o conforto dos nossos clientes. Por isso, todos os nossos imóveis são cuidadosamente apresentados com descrição e critério, visando alcançar o público certo — sem exposições desnecessárias ou visitas sem propósito.
                </p>
                <p className="text-lg leading-relaxed text-center mb-8">
                  Nosso compromisso com os proprietários é entregar propostas reais, de clientes verdadeiramente interessados e com potencial validado, antes mesmo de qualquer movimentação.
                </p>
                <p className="text-lg leading-relaxed text-center">
                  Trabalhamos com foco em eficiência, segurança e resultados, respeitando o tempo e o patrimônio de quem confia em nós.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-luxury p-8 rounded-lg text-background text-center">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Aqui, qualidade vem antes da quantidade
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Atendemos cada cliente com foco total, sem pressa, sem volume, e com toda a atenção que grandes patrimônios exigem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="lg" className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6">
                Solicitar Avaliação Patrimonial
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-background/10 hover:bg-background/20 text-background border-background/30">
                Agendar Reunião Confidencial
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-background/10 hover:bg-background/20 text-background border-background/30 gap-3">
                <MessageCircle className="h-5 w-5" />
                WhatsApp VIP
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-luxury-dark text-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Seja bem atendido. Com discrição. Com segurança. Com excelência.
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Entre em contato conosco e descubra como podemos elevar seu patrimônio 
            ao próximo nível com total confidencialidade e profissionalismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="gold" size="lg" className="text-lg px-8 py-6 gap-3">
              <Phone className="h-5 w-5" />
              Agendar Reunião Confidencial
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-background/10 hover:bg-background/20 text-background border-background/30 gap-3">
              <MessageCircle className="h-5 w-5" />
              WhatsApp VIP
            </Button>
          </div>
          <div className="text-sm opacity-75">
            <Mail className="h-4 w-4 inline mr-2" />
            vip@teomiprime.com.br • Resposta em até 2 horas úteis
          </div>
        </div>
      </section>
    </div>
  );
}
