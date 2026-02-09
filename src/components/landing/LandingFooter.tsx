import { Link } from "react-router-dom";
import { GraduationCap, Globe } from "lucide-react";
import { useI18n } from "@/i18n";

const SUPPORT_EMAIL = "support@studai.app";

function isHomePath() {
  return typeof window !== "undefined" && window.location.pathname === "/";
}

export function LandingFooter() {
  const { t, locale, setLocale } = useI18n();

  const goToHash = (hash: string) => {
    if (!isHomePath()) { window.location.assign(`/${hash}`); return; }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleLocale = () => {
    setLocale(locale === "pt-BR" ? "en-US" : "pt-BR");
  };

  type FooterLink = { label: string; href: string; kind: "hash" | "route" | "external" };

  const footerLinks: Record<string, FooterLink[]> = {
    produto: [
      { label: t("footer.resources"), href: "#produto", kind: "hash" },
      { label: t("footer.howItWorks"), href: "#como-funciona", kind: "hash" },
      { label: t("footer.plans"), href: "#planos", kind: "hash" },
      { label: t("footer.faqLink"), href: "#faq", kind: "hash" },
    ],
    empresa: [
      { label: t("common.about"), href: "/sobre", kind: "route" },
      { label: t("common.contact"), href: "/contato", kind: "route" },
    ],
    suporte: [
      { label: t("footer.talkToSupport"), href: `mailto:${SUPPORT_EMAIL}`, kind: "external" },
      { label: t("common.security"), href: "/seguranca", kind: "route" },
      { label: t("common.privacy"), href: "/privacidade", kind: "route" },
    ],
    legal: [
      { label: t("common.privacy"), href: "/privacidade", kind: "route" },
      { label: t("common.terms"), href: "/termos", kind: "route" },
      { label: t("common.security"), href: "/seguranca", kind: "route" },
    ],
  };

  const renderLink = (link: FooterLink) => {
    const baseClass = "text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium min-h-[40px] flex items-center";
    if (link.kind === "hash") return <button onClick={() => goToHash(link.href)} className={baseClass}>{link.label}</button>;
    if (link.kind === "route") return <Link to={link.href} className={baseClass}>{link.label}</Link>;
    return <a href={link.href} className={baseClass} rel="noopener noreferrer">{link.label}</a>;
  };

  return (
    <footer className="bg-card border-t-2 py-10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground text-lg">StudAI</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed font-medium max-w-xs">{t("footer.tagline")}</p>
            <p className="text-xs text-muted-foreground font-medium">
              {t("common.support")}:{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{SUPPORT_EMAIL}</a>
            </p>

            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="mt-3 flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-lg border-2 border-border hover:border-primary/40 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={locale === "pt-BR" ? "Switch to English" : "Mudar para Português"}
            >
              <Globe className="h-3.5 w-3.5" />
              {locale === "pt-BR" ? "English" : "Português"}
            </button>
          </div>

          <nav aria-label={t("common.product")}>
            <h4 className="font-bold text-foreground mb-2 text-sm">{t("common.product")}</h4>
            <ul className="space-y-1">{footerLinks.produto.map((link) => <li key={link.label}>{renderLink(link)}</li>)}</ul>
          </nav>

          <nav aria-label={t("common.company")}>
            <h4 className="font-bold text-foreground mb-2 text-sm">{t("common.company")}</h4>
            <ul className="space-y-1">{footerLinks.empresa.map((link) => <li key={link.label}>{renderLink(link)}</li>)}</ul>
          </nav>

          <nav aria-label={t("common.support")}>
            <h4 className="font-bold text-foreground mb-2 text-sm">{t("common.support")}</h4>
            <ul className="space-y-1">{footerLinks.suporte.map((link) => <li key={link.label}>{renderLink(link)}</li>)}</ul>
          </nav>

          <nav aria-label={t("common.legal")}>
            <h4 className="font-bold text-foreground mb-2 text-sm">{t("common.legal")}</h4>
            <ul className="space-y-1">{footerLinks.legal.map((link) => <li key={link.label}>{renderLink(link)}</li>)}</ul>
          </nav>
        </div>

        <div className="mt-8 pt-5 border-t-2 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground font-medium">
            © {new Date().getFullYear()} StudAI. {t("footer.allRights")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium min-h-[36px] flex items-center px-1">{SUPPORT_EMAIL}</a>
            <Link to="/privacidade" className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium min-h-[36px] flex items-center px-1">{t("common.privacy")}</Link>
            <Link to="/termos" className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium min-h-[36px] flex items-center px-1">{t("common.terms")}</Link>
            <Link to="/seguranca" className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium min-h-[36px] flex items-center px-1">{t("common.security")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
