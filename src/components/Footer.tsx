import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook, Linkedin } from "lucide-react";

const navigation = {
  main: [
    { name: "Imóveis", href: "/imoveis" },
    { name: "Sobre", href: "/sobre" },
    { name: "Contato", href: "/contato" },
  ],
  social: [
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "LinkedIn", href: "#", icon: Linkedin },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-luxury-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="font-serif text-2xl font-bold bg-gradient-silver bg-clip-text text-transparent">
                Teomi Prime
              </span>
              <p className="text-sm text-white/80 mt-2">
                Exclusividade, Confiança e Discrição no Mercado de Altíssimo Padrão
              </p>
            </div>
            <div className="flex gap-4">
              {navigation.social.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-accent hover:bg-white/10"
                  asChild
                >
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <item.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Navegação</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-white/80 text-sm">(12) 3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-accent" />
                <span className="text-white/80 text-sm">(12) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-white/80 text-sm">contato@teomiprime.com.br</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent mt-0.5" />
                <span className="text-white/80 text-sm">
                  Avenida Independência, 70<br />
                  Taubaté - SP
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Atendimento</h3>
            <p className="text-white/80 text-sm mb-4">
              Entre em contato para um atendimento exclusivo e personalizado
            </p>
            <div className="space-y-3">
              <Button variant="gold" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 transition-all">
                Agendar Reunião
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm">
              © 2024 Teomi Prime. Todos os direitos reservados.
            </p>
            <p className="text-white/80 text-sm mt-2 md:mt-0">
              by Teomi Imóveis - CRECI: 37.355J
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
