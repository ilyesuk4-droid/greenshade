import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export interface NavbarProps {
  onOpenCart: () => void;
  cartItemCount: number;
}

export function Navbar({ onOpenCart, cartItemCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-linen/95 backdrop-blur-md border-b border-border/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand & Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cladode rounded-lg p-1 group"
        >
          <img
            src={siteConfig.logoPath}
            alt={`Logo officiel ${siteConfig.brandName}`}
            className="w-11 h-11 object-cover rounded-full shadow-sm border border-border/60 bg-white"
          />
          <div className="flex flex-col">
            <span className="font-fraunces font-bold text-2xl text-nopal tracking-tight leading-none group-hover:text-cladode transition-colors">
              {siteConfig.brandName}
            </span>
            <span className="text-[11px] font-medium text-cladode tracking-wider uppercase mt-0.5">
              {siteConfig.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-encre/80">
          <Link
            to="/"
            className="hover:text-nopal transition-colors py-1 [&.active]:text-nopal [&.active]:font-semibold"
          >
            Accueil
          </Link>
          <Link
            to="/produits"
            className="hover:text-nopal transition-colors py-1 [&.active]:text-nopal [&.active]:font-semibold"
          >
            Nos Produits
          </Link>
          <Link
            to="/contact"
            className="hover:text-nopal transition-colors py-1 [&.active]:text-nopal [&.active]:font-semibold"
          >
            Contact
          </Link>
        </nav>

        {/* Right Action: Cart Button & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Voir le panier"
            className="relative p-2.5 rounded-full text-nopal hover:bg-hydrogel focus:outline-none focus:ring-2 focus:ring-cladode transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cladode text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-75 duration-200">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger via Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                className="md:hidden p-2 rounded-lg text-nopal hover:bg-hydrogel focus:outline-none focus:ring-2 focus:ring-cladode cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-linen p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle className="font-fraunces text-2xl text-nopal">
                    {siteConfig.brandName}
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground">{siteConfig.headline}</p>
                </SheetHeader>

                <nav className="flex flex-col gap-4 text-base font-medium">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 border-b border-border/60 hover:text-nopal"
                  >
                    Accueil
                  </Link>
                  <Link
                    to="/produits"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 border-b border-border/60 hover:text-nopal"
                  >
                    Nos Produits
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 border-b border-border/60 hover:text-nopal"
                  >
                    Contact
                  </Link>
                </nav>
              </div>

              <div className="pt-6 border-t border-border/60 text-xs text-muted-foreground text-center">
                <p>{siteConfig.tagline}</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
