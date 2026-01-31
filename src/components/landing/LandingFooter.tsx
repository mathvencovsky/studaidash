import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  produto: [
    { label: "Recursos", href: "#produto" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Planos", href: "#planos" },
    { label: "FAQ", href: "#faq" },
  ],
  empresa: [
    { label: "Sobre", href: "/sobre", isRoute: true },
    { label: "Contato", href: "/contato", isRoute: true },
  ],
  legal: [
    { label: "Privacidade", href: "/privacidade", isRoute: true },
    { label: "Termos de Uso", href: "/termos", isRoute: true },
    { label: "Segurança", href: "/seguranca", isRoute: true },
  ],
};

export function LandingFooter() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">StudAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Organize seus estudos. Veja seu progresso real.
            </p>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Produto</h4>
            <ul className="space-y-2">
              {footerLinks.produto.map((link) => (
                <li key={link.label}>
                  <button 
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StudAI. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            {/* TODO: Substituir por e-mail real */}
            contato@studai.com.br
          </p>
        </div>
      </div>
    </footer>
  );
}
