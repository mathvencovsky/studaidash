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
    { label: "Falar com o suporte", href: `mailto:${SUPPORT_EMAIL}`, kind: "external" },
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
      "text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded";

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
    <footer className="bg-card border-t py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">StudAI</span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Organize seus estudos com clareza. Acompanhe seu progresso com consistência.
            </p>

            <p className="text-xs text-muted-foreground">
              Suporte:{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>

          {/* Produto */}
          <nav aria-label="Produto">
            <h4 className="font-medium text-foreground mb-3 text-sm">Produto</h4>
            <ul className="space-y-2">
              {footerLinks.produto.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </nav>

          {/* Empresa */}
          <nav aria-label="Empresa">
            <h4 className="font-medium text-foreground mb-3 text-sm">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </nav>

          {/* Suporte */}
          <nav aria-label="Suporte">
            <h4 className="font-medium text-foreground mb-3 text-sm">Suporte</h4>
            <ul className="space-y-2">
              {footerLinks.suporte.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <h4 className="font-medium text-foreground mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StudAI. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4 text-sm">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              {SUPPORT_EMAIL}
            </a>
            <Link
              to="/privacidade"
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Privacidade
            </Link>
            <Link
              to="/termos"
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Termos
            </Link>
            <Link
              to="/seguranca"
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Segurança
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
