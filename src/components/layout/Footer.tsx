import { Link } from "@tanstack/react-router";
import { ExternalLink, Instagram, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-nopal text-linen py-12 border-t border-aloe/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/10">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <img
              src={siteConfig.logoPath}
              alt={siteConfig.brandName}
              className="w-12 h-12 object-cover rounded-full bg-white p-0.5 border border-white/20"
            />
            <div>
              <span className="font-fraunces text-2xl font-bold tracking-tight text-white block">
                {siteConfig.brandName}
              </span>
              <span className="text-xs text-aloe">{siteConfig.tagline}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-linen/80">
            <Link to="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <Link to="/produits" className="hover:text-white transition-colors">
              Nos Produits
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 flex items-center justify-center transition-colors text-white"
              title="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center transition-colors text-white"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-cladode flex items-center justify-center transition-colors text-white"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom bar with copyright and developer credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-linen/70">
          <div>
            © 2026 {siteConfig.brandName}. Tous droits réservés. {siteConfig.headline}.
          </div>

          {/* Developer Credit Preserved */}
          <div className="flex items-center gap-1">
            <span>Développé avec soin par</span>
            <a
              href="https://ilyas-portfolio.carrd.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aloe font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>إلياس بدر الدين</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
