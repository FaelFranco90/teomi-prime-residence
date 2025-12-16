import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import { getWhatsAppURL } from "@/config/contact";
import { useTheme } from "next-themes";
import logoLight from "@/assets/logo-teomi-light.png";
import logoDark from "@/assets/logo-teomi-dark.png";

const navigation = [
  { name: "Imóveis", href: "/imoveis" },
  { name: "Contato", href: "/contato" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "dark" ? logoDark : logoLight;

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex flex-col items-start">
              <img 
                src={logoSrc} 
                alt="Teomi Imóveis" 
                className="h-10 w-auto"
              />
              <span className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase mt-0.5">
                Prime
              </span>
            </Link>
          </div>
          
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium leading-6 transition-colors hover:text-accent",
                  location.pathname === item.href
                    ? "text-accent"
                    : "text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-4">
            <ThemeToggle />
            <Button 
              variant="gold" 
              className="gap-2"
              onClick={() => window.open(getWhatsAppURL(), '_blank')}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50"></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
              <div className="flex items-center justify-between">
                <Link to="/" className="-m-1.5 p-1.5 flex flex-col items-start">
                  <img 
                    src={logoSrc} 
                    alt="Teomi Imóveis" 
                    className="h-9 w-auto"
                  />
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-accent uppercase mt-0.5">
                    Prime
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-border">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 transition-colors hover:bg-muted",
                          location.pathname === item.href
                            ? "text-accent"
                            : "text-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6 space-y-3">
                    <div className="flex justify-center">
                      <ThemeToggle />
                    </div>
                    <Button 
                      variant="gold" 
                      className="w-full gap-2"
                      onClick={() => window.open(getWhatsAppURL(), '_blank')}
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="gold"
          size="lg"
          className="rounded-full shadow-luxury hover:shadow-silver"
          onClick={() => window.open(getWhatsAppURL(), '_blank')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
}
