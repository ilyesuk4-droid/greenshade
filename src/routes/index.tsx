import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Droplets, CheckCircle2, Phone, Instagram, Mail, Calendar, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useProductsCatalog } from "@/lib/products-store";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { products } = useProductsCatalog();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ========================================================= */}
      {/* 1. Hero Section                                           */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 bg-gradient-to-b from-hydrogel/50 via-linen to-linen border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start fade-in-up">
              {/* Brand Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hydrogel border border-aloe/60 text-nopal text-xs sm:text-sm font-semibold mb-6 shadow-sm">
                <Sparkles className="w-4 h-4 text-cladode" />
                <span>{siteConfig.tagline}</span>
              </div>

              <h1 className="font-fraunces text-4xl sm:text-5xl lg:text-6xl text-nopal font-bold tracking-tight leading-[1.15] mb-6">
                {siteConfig.headline}
              </h1>

              <p className="text-base sm:text-lg text-encre/80 leading-relaxed mb-8 max-w-2xl">
                {siteConfig.description} Spécialiste des déodorants naturels formulés{" "}
                <strong>sans alcool</strong> et <strong>sans sels d'aluminium</strong>, assurant jusqu'à{" "}
                <strong>72h de protection</strong> tout en prenant soin de votre peau.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
                <Link
                  to="/produits"
                  className="btn-cta text-base px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-nature"
                >
                  <span>Découvrir nos produits</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={siteConfig.whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-nature text-base px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Commander sur WhatsApp</span>
                </a>
              </div>

              {/* Quick Contact & Social row */}
              <div className="pt-6 border-t border-border/80 flex flex-wrap items-center gap-5 text-xs text-muted-foreground font-medium">
                <span>Nous contacter directement :</span>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="hover:text-nopal flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-cladode" />
                  <span>{siteConfig.contact.whatsappDisplay}</span>
                </a>
                <a
                  href={siteConfig.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-nopal flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5 text-cladode" />
                  <span>@{siteConfig.social.instagram.handle}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-nopal flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-cladode" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </div>
            </div>

            {/* Right Product Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-aloe/30 via-hydrogel to-transparent filter blur-xl opacity-70" />
                <div className="relative rounded-3xl bg-white p-6 sm:p-8 border border-white/80 shadow-nature-lg flex flex-col items-center text-center">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden mb-6 shadow-sm border border-border/40">
                    <img
                      src={siteConfig.logoPath}
                      alt={siteConfig.brandName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-cladode uppercase tracking-wider">
                    Gamme Déodorants Naturels
                  </span>
                  <h3 className="font-fraunces text-2xl font-bold text-nopal mt-1 mb-2">
                    Peach & Musc Grenade
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Formule sans traces • Convient à toutes les peaux • Fraîcheur naturelle
                  </p>
                  <Link
                    to="/produits"
                    className="btn-outline-nature text-xs px-5 py-2 rounded-lg font-semibold w-full"
                  >
                    Voir la gamme complète
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. Cosmenex Expo Sétif Banner                             */}
      {/* ========================================================= */}
      <section className="bg-nopal text-linen py-5 border-y border-aloe/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-aloe">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-aloe block">
                  Événement — {siteConfig.expo.name}
                </span>
                <span className="font-fraunces text-lg sm:text-xl font-bold text-white">
                  Retrouvez GREEN SHADE à Sétif du 28 au 31 Octobre 2026 !
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-lg text-linen shrink-0">
              <MapPin className="w-4 h-4 text-aloe" />
              <span>Sétif, Algérie</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. Core Values & Certified Claims                          */}
      {/* ========================================================= */}
      <section className="py-20 lg:py-24 bg-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-cladode">
              Formulation & Efficacité
            </span>
            <h2 className="font-fraunces text-3xl sm:text-4xl text-nopal font-bold mt-2 mb-4">
              Pourquoi choisir GREEN SHADE ?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Des soins naturels formulés avec rigueur, simples et sans compromis sur votre santé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-border/80 shadow-sm hover:border-cladode/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-fraunces text-lg font-bold text-nopal mb-2">
                Sans alcool ni sels d'aluminium
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Respecte les mécanismes naturels de transpiration sans obstruer les pores.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-border/80 shadow-sm hover:border-cladode/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-fraunces text-lg font-bold text-nopal mb-2">
                Protection jusqu'à 72h
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Une efficacité longue durée prouvée pour vous accompagner sereinement au quotidien.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-border/80 shadow-sm hover:border-cladode/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-4">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-fraunces text-lg font-bold text-nopal mb-2">
                Tous types de peau
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Formules douces testées pour convenir parfaitement aux peaux normales comme sensibles.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-6 border border-border/80 shadow-sm hover:border-cladode/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-fraunces text-lg font-bold text-nopal mb-2">
                Ne tache pas les vêtements
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Texture agréable à séchage rapide, sans résidus gras ni auréoles blanches ou jaunes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. Aperçu des Fragrances / Produits Vedettes              */}
      {/* ========================================================= */}
      <section className="py-20 lg:py-24 bg-hydrogel/40 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cladode">
                Gamme Exclusive
              </span>
              <h2 className="font-fraunces text-3xl sm:text-4xl text-nopal font-bold mt-2">
                Nos Meilleurs Soins
              </h2>
            </div>
            <Link
              to="/produits"
              className="text-xs font-semibold text-cladode hover:text-nopal flex items-center gap-1.5"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col group hover:shadow-nature transition-all"
              >
                <div className="aspect-square bg-linen/50 overflow-hidden relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-nopal">
                    {siteConfig.currency.format(p.price)}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-fraunces font-bold text-lg text-nopal mb-1">
                      {p.shortTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                      {p.description}
                    </p>
                  </div>
                  <Link
                    to="/produits"
                    className="btn-outline-nature text-xs py-2 rounded-lg text-center font-semibold"
                  >
                    Voir le détail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
