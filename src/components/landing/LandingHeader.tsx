import { useState, useEffect } from "react";
import { GraduationCap, Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useI18n } from "@/i18n";

export function LandingHeader() {
  const { t, locale, setLocale } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("header.product"), href: "#produto" },
    { label: t("header.howItWorks"), href: "#como-funciona" },
    { label: t("header.testimonials"), href: "#depoimentos" },
    { label: t("header.plans"), href: "#planos" },
    { label: t("header.faq"), href: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const scrollToAuth = () => {
    const authCard = document.querySelector("#auth-card");
    if (authCard) {
      authCard.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const emailInput = authCard.querySelector('input[type="email"]') as HTMLInputElement;
        emailInput?.focus();
      }, 500);
    }
    setMobileOpen(false);
  };

  const toggleLocale = () => {
    setLocale(locale === "pt-BR" ? "en-US" : "pt-BR");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-card/95 backdrop-blur-md border-b-2 shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-xl">StudAI</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-lg border-2 border-border hover:border-primary/40 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={locale === "pt-BR" ? "Switch to English" : "Mudar para Português"}
            >
              <Globe className="h-3.5 w-3.5" />
              {locale === "pt-BR" ? "EN" : "PT"}
            </button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={scrollToAuth}
              className="font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {t("common.login")}
            </Button>
            <Button 
              size="sm" 
              onClick={scrollToAuth}
              className="font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {t("common.startFree")}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                {/* Language Toggle - Mobile */}
                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Globe className="h-4 w-4" />
                  {locale === "pt-BR" ? "English" : "Português"}
                </button>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => scrollToSection(link.href)}
                      className="text-left font-semibold text-foreground hover:bg-muted/50 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 pt-4 border-t-2">
                  <Button variant="outline" size="lg" onClick={scrollToAuth} className="font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    {t("common.login")}
                  </Button>
                  <Button size="lg" onClick={scrollToAuth} className="font-semibold bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    {t("common.startFree")}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
