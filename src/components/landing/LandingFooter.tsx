import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

type FooterLink = {
  label: string;
  href: string;
  kind: "hash" | "route" | "external";
};

const SUPPORT_EMAIL = "support@studai.app";

const footerLinks: Record<string, FooterLink[]> = {
  produto: [
    { label: "Recursos", href: "#produto", kind: "hash" },
    { label: "Como funciona", href: "#como-funciona", kind: "hash" },
    { label: "Planos", href: "#planos", kind: "hash" },
    { label: "FAQ", href: "#faq", kind: "hash" },
  ],
  empresa: [
    { label: "Sobre", href: "/sobre", kind: "route" },
    { label: "Contato", href: "/contato", kind: "route" },
  ],
  suporte: [
    { label: "Falar com suporte", href: `mailto:${SUPPORT_EMAIL}`, kind: "external" },
    { label: "Segurança", href: "/seguranca", kind: "route" },
    { label: "Privacidade", href: "/privacidade", kind: "route" },
  ],
  legal: [
    { label: "Privacidade", href: "/privacidade", kind: "route" },
    { label: "Termos de Uso", href: "/termos", kind: "route" },
    { label: "Segurança", href: "/seguranca", kind: "route" },
  ],
};

function isHomePath() {
  return typeof window !== "undefined" && window.location.pathname === "/";
}

export function LandingFooter() {
  const goToHash = (hash: string) => {
    if (!isHomePath()) {
      window.location.assign(`/${hash}`);
      return;
    }

    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderLink = (link: FooterLink) => {
    const baseClass =
      "text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium min-h-[40px] flex items-center";

    if (link.kind === "hash") {
      return (
        <button onClick={() => goToHash(link.href)} className={baseClass}>
          {link.label}
        </button>
      );
    }

    if (link.kind === "route") {
      return (
        <Link to={link.href} className={baseClass}>
          {link.label}
        </Link>
      );
    }

    return (
      <a href={link.href} className={baseClass} rel="noopener noreferrer">
        {link.label}
      </a>
    );
  };

  return (
    <footer className="bg-card border-t-2 py-10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: 2 cols, Desktop: 5 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground text-lg">StudAI</span>
            </div>

            <p className="text-xs text-muted-foreground mb-3 leading-relaxed font-medium max-w-xs">
              Organize seus estudos com clareza. Acompanhe seu progresso com consistência.
            </p>

            <p className="text-xs text-muted-foreground font-medium">
              Suporte:{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>

          {/* Produto */}
          <nav aria-label="Produto">
            <h4 className="font-bold text-foreground mb-2 text-sm">Produto</h4>
            <ul className="space-y-1">
              {footerLinks.produto.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </nav>

          {/* Empresa */}
          <nav aria-label="Empresa">
            <h4 className="font-bold text-foreground mb-2 text-sm">Empresa</h4>
            <ul className="space-y-1">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </nav>

          {/* Suporte */}
          <nav aria-label="Suporte">
            <h4 className="font-bold text-foreground mb-2 text-sm">Suporte</h4>
            <ul className="space-y-1">
              {footerLinks.suporte.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <h4 className="font-bold text-foreground mb-2 text-sm">Legal</h4>
            <ul className="space-y-1">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-5 border-t-2 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground font-medium">
            © {new Date().getFullYear()} StudAI. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium min-h-[36px] flex items-center px-1"
            >
              {SUPPORT_EMAIL}
            </a>
            <Link
              to="/privacidade"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium min-h-[36px] flex items-center px-1"
            >
              Privacidade
            </Link>
            <Link
              to="/termos"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium min-h-[36px] flex items-center px-1"
            >
              Termos
            </Link>
            <Link
              to="/seguranca"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium min-h-[36px] flex items-center px-1"
            >
              Segurança
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
