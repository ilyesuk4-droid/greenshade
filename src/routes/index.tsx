import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Leaf,
  FlaskConical,
  PackageCheck,
  GraduationCap,
  Phone,
  Mail,
  Facebook,
  Instagram,
  CheckCircle2,
  Menu,
  X,
  Send,
  Loader2,
  Sparkles,
  Shield,
  ArrowRight,
  Droplets,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store-context";
import { WILAYAS } from "@/lib/wilayas";
import { submitInquiry } from "@/lib/inquiries-service";

// Static local assets fallback
import heroBg from "@/assets/hero-bg.png";
import cactusProduit from "@/assets/cactus-produit.png";
import utilisationPatch from "@/assets/utilisation-patch.jpg";
import pharmaciePro from "@/assets/pharmacie-pro.jpg";
import hydrogelSeparator from "@/assets/hydrogel-separator.jpg";
import defaultLogo from "@/assets/patchnature-logo.jpeg";
import defaultPackaging from "@/assets/image2.png";
import defaultBox from "@/assets/patchnature-box.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Static local asset sources (bundled with the frontend)
  const logoSrc = defaultLogo;
  const heroProductSrc = defaultBox;
  const secondaryProductSrc = defaultPackaging;
  
  const heroBgSrc = heroBg;
  const cactusProduitSrc = cactusProduit;
  const hydrogelSeparatorSrc = hydrogelSeparator;
  const utilisationPatchSrc = utilisationPatch;
  const pharmacieProSrc = pharmaciePro;

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linen text-encre selection:bg-aloe selection:text-nopal">
      {/* ========================================================= */}
      {/* 1. Header / Navigation */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-linen/90 backdrop-blur-md border-b border-border/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <a
            href="#"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cladode rounded-lg p-1"
          >
            <img
              src={logoSrc}
              alt="Logo officiel PatchNature"
              className="w-11 h-11 object-contain rounded-lg shadow-sm border border-border/60 bg-white"
            />
            <div className="flex flex-col">
              <span className="font-fraunces font-bold text-2xl text-nopal tracking-tight leading-none">
                PatchNature
              </span>
              <span className="text-[11px] font-medium text-cladode tracking-wider uppercase mt-0.5">
                Soin Végétal & Hydrogel
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-encre/80">
            <button
              onClick={() => scrollTo("hero")}
              className="hover:text-nopal transition-colors cursor-pointer"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollTo("produit")}
              className="hover:text-nopal transition-colors cursor-pointer"
            >
              Notre produit
            </button>
            <button
              onClick={() => scrollTo("atouts")}
              className="hover:text-nopal transition-colors cursor-pointer"
            >
              Les atouts
            </button>
            <button
              onClick={() => scrollTo("utilisation")}
              className="hover:text-nopal transition-colors cursor-pointer"
            >
              Mode d'emploi
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="hover:text-nopal transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Header Action Button */}
          <div className="hidden md:flex items-center gap-4">
            {settings.show_inquiry_form && (
              <button
                onClick={() => scrollTo("contact-pro")}
                className="btn-cta text-sm px-5 py-2.5 rounded-lg cursor-pointer"
              >
                Espace Professionnel
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="md:hidden p-2 rounded-lg text-nopal hover:bg-hydrogel focus:outline-none focus:ring-2 focus:ring-cladode"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-linen border-b border-border px-6 py-5 flex flex-col gap-4 text-base font-medium shadow-xl">
            <button
              onClick={() => scrollTo("hero")}
              className="text-left py-2 hover:text-nopal"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollTo("produit")}
              className="text-left py-2 hover:text-nopal"
            >
              Notre produit
            </button>
            <button
              onClick={() => scrollTo("atouts")}
              className="text-left py-2 hover:text-nopal"
            >
              Les atouts
            </button>
            <button
              onClick={() => scrollTo("utilisation")}
              className="text-left py-2 hover:text-nopal"
            >
              Mode d'emploi
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="text-left py-2 hover:text-nopal"
            >
              Contact
            </button>
            {settings.show_inquiry_form && (
              <button
                onClick={() => scrollTo("contact-pro")}
                className="btn-cta text-center py-3 rounded-lg mt-2"
              >
                Espace Professionnel
              </button>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ========================================================= */}
        {/* 2. Section 1 — Hero */}
        {/* ========================================================= */}
        <section
          id="hero"
          className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden py-16 lg:py-24"
        >
          {/* Hero Botanical Background Illustration */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 opacity-40">
            <img
              src={heroBgSrc}
              alt="Illustration botanique de cladodes de figuier de Barbarie, identité visuelle PatchNature"
              fetchPriority="high"
              loading="eager"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle linen gradient overlay for optimal reading comfort */}
            <div className="absolute inset-0 bg-gradient-to-r from-linen/90 via-linen/75 to-linen/85" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headings & Value proposition */}
              <div className="lg:col-span-7 flex flex-col items-start fade-in-up">
                {/* Algerian Innovation Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hydrogel border border-aloe/60 text-nopal text-xs sm:text-sm font-medium mb-6 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-cladode animate-pulse" />
                  <span>Innovation développée en Algérie</span>
                  <span role="img" aria-label="Drapeau Algérie">
                    🇩🇿
                  </span>
                </div>

                <h1 className="font-fraunces text-4xl sm:text-5xl lg:text-6xl text-nopal font-bold tracking-tight leading-[1.15] mb-6">
                  PatchNature
                </h1>

                <p className="text-xl sm:text-2xl font-semibold text-nopal/90 leading-snug mb-4">
                  Patch naturel anti-inflammatoire à base d'hydrogel de cladodes de figuier de
                  Barbarie.
                </p>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                  Une solution innovante pour les soins de la peau, associant un extrait végétal
                  local d'<em>Opuntia ficus-indica</em> à la performance d'une technologie
                  hydrogel biocompatible.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => scrollTo("produit")}
                    className="btn-cta text-base px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Découvrir le produit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {settings.show_inquiry_form && (
                    <button
                      onClick={() => scrollTo("contact-pro")}
                      className="btn-outline-nature text-base px-6 py-3.5 rounded-lg flex items-center justify-center cursor-pointer"
                    >
                      Espace Professionnel
                    </button>
                  )}
                </div>

                {/* Key attributes pills */}
                <div className="mt-10 pt-6 border-t border-border/80 flex flex-wrap gap-6 text-xs sm:text-sm text-encre/80 font-medium">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-cladode" />
                    <span>100% Matière végétale locale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cladode" />
                    <span>Hydrogel hydratant continu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cladode" />
                    <span>Recherche universitaire</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Product Visual */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative w-full max-w-md">
                  {/* Decorative background shape */}
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-aloe/20 via-hydrogel to-transparent filter blur-xl opacity-70" />

                  <div className="relative rounded-3xl bg-white/80 p-6 sm:p-8 backdrop-blur-sm border border-white/60 shadow-nature-lg">
                    <img
                      src={heroProductSrc}
                      alt="Conditionnement PatchNature, boîte de 10 patchs hydrogel anti-inflammatoires"
                      className="w-full h-auto object-contain rounded-xl max-h-[380px] drop-shadow-md mx-auto"
                    />

                    <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-nopal">Format Officine</span>
                      <span className="inline-flex items-center gap-1.5 bg-hydrogel text-nopal px-2.5 py-1 rounded-full font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cladode" />
                        Boîte de 10 patchs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. Section 2 — Notre Produit */}
        {/* ========================================================= */}
        <section id="produit" className="py-20 lg:py-28 bg-hydrogel/60 border-y border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-cladode">
                Origine & Formulation
              </span>
              <h2 className="font-fraunces text-3xl sm:text-4xl text-nopal font-bold mt-2 mb-4">
                Notre Produit
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                L'alliance harmonieuse entre les vertus ancestrales des cladodes et l'ingénierie
                moderne des biomatériaux.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image composite: Cactus macro + Packaging sachet */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="relative">
                  {/* Primary macro image: cladodes with water drops */}
                  <div className="overflow-hidden rounded-2xl shadow-nature border border-white/60 bg-white">
                    <img
                      src={cactusProduitSrc}
                      alt="Cladodes de figuier de Barbarie avec gouttelettes d'eau, matière première du patch hydrogel"
                      loading="lazy"
                      className="w-full h-[320px] sm:h-[400px] object-cover hover:scale-102 transition-transform duration-500"
                    />
                  </div>

                  {/* Overlaid packaging preview card */}
                  <div className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-6 w-44 sm:w-56 rounded-2xl bg-white p-3 shadow-nature-lg border border-border">
                    <img
                      src={secondaryProductSrc}
                      alt="Sachet protecteur individuel PatchNature avec patch hydrogel visible"
                      loading="lazy"
                      className="w-full h-auto object-contain rounded-lg"
                    />
                    <div className="mt-2 text-center text-[11px] font-semibold text-nopal">
                      Sachet protecteur individuel
                    </div>
                  </div>
                </div>
              </div>

              {/* Text description */}
              <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
                <div className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-white shadow-nature">
                  <h3 className="font-fraunces text-2xl text-nopal font-bold mb-4">
                    Patch hydrogel à base de cladodes de figuier de Barbarie
                  </h3>

                  <p className="text-base text-encre/90 leading-relaxed mb-6">
                    <strong>PatchNature</strong> est un patch hydrogel formulé à partir d'extraits
                    de cladodes d'<em>Opuntia ficus-indica</em>, spécialement conçu pour offrir une
                    application cutanée ciblée, pratique et hautement tolérée.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-lg bg-hydrogel text-cladode">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-nopal">
                          Matrice hydrogel rafraîchissante
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          Assure un maintien continu de l'humidité cutanée favorisant l'apaisement
                          rapide des irritations et des zones sensibles.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-lg bg-hydrogel text-cladode">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-nopal">
                          Action anti-inflammatoire naturelle
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          Les mucilages et polysaccharides des raquettes de figuier agissent en
                          synergie pour soulager et réparer l'épiderme.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-lg bg-hydrogel text-cladode">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-nopal">
                          Confort d'application et tolérance
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          Adhésion douce sans tiraillement, respectant la barrière cutanée lors du
                          retrait.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. Section 3 — Les Atouts */}
        {/* ========================================================= */}
        <section id="atouts" className="py-20 lg:py-28 bg-linen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-cladode">
                Pourquoi choisir PatchNature
              </span>
              <h2 className="font-fraunces text-3xl sm:text-4xl text-nopal font-bold mt-2 mb-4">
                Les Atouts de PatchNature
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Une conception rigoureuse qui répond aux exigences des professionnels de santé et
                aux attentes des utilisateurs.
              </p>
            </div>

            {/* Asymmetric grid layout: 1 large hero card + 3 supporting cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Large Featured Card (Spans 2 columns on desktop) */}
              <div className="md:col-span-2 rounded-3xl bg-white p-8 sm:p-10 border border-border/80 shadow-nature flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-hydrogel/50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-hydrogel text-nopal flex items-center justify-center mb-6">
                    <Leaf className="w-7 h-7 text-cladode" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cladode">
                    Atout Majeur
                  </span>
                  <h3 className="font-fraunces text-2xl sm:text-3xl text-nopal font-bold mt-2 mb-4">
                    Origine Végétale & Valorisation Locale
                  </h3>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl">
                    Les cladodes de figuier de Barbarie sont directement intégrés à la formulation
                    du patch. Nous valorisons une ressource végétale emblématique du terroir
                    algérien, réputée pour sa richesse exceptionnelle en principes actifs
                    protecteurs.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border/60 flex items-center gap-3 text-sm font-semibold text-nopal">
                  <Sparkles className="w-4 h-4 text-cladode" />
                  <span>Matériau bio-sourcé et éco-responsable</span>
                </div>
              </div>

              {/* Card 2: Technologie hydrogel */}
              <div className="rounded-3xl bg-white p-8 border border-border/80 shadow-nature flex flex-col justify-between group hover:border-cladode/40 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-hydrogel text-nopal flex items-center justify-center mb-6">
                    <FlaskConical className="w-6 h-6 text-cladode" />
                  </div>
                  <h3 className="font-fraunces text-xl text-nopal font-bold mb-3">
                    Technologie Hydrogel
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Une formulation polymère avancée conçue pour assurer un contact intime et
                    adapté avec la peau, favorisant la libération progressive des actifs.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/50 text-xs font-medium text-cladode">
                  Hydratation biocompatible
                </div>
              </div>

              {/* Card 3: Format pratique */}
              <div className="rounded-3xl bg-white p-8 border border-border/80 shadow-nature flex flex-col justify-between group hover:border-cladode/40 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-hydrogel text-nopal flex items-center justify-center mb-6">
                    <PackageCheck className="w-6 h-6 text-cladode" />
                  </div>
                  <h3 className="font-fraunces text-xl text-nopal font-bold mb-3">
                    Format Pratique
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Un patch individuel sous sachet protecteur, simple à manipuler, hygiénique, et
                    ne laissant aucun film gras ou résidu collant.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/50 text-xs font-medium text-cladode">
                  Application nomade & propre
                </div>
              </div>

              {/* Card 4: Développement scientifique (Spans 2 columns on desktop) */}
              <div className="md:col-span-2 rounded-3xl bg-gradient-to-r from-white to-hydrogel/40 p-8 sm:p-10 border border-border/80 shadow-nature flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-hydrogel text-nopal flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-cladode" />
                  </div>
                  <h3 className="font-fraunces text-2xl text-nopal font-bold mb-2">
                    Développement Scientifique
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
                    Un produit issu d'un projet rigoureux de recherche universitaire, développé
                    selon une méthodologie scientifique stricte.
                  </p>
                </div>
                <div className="shrink-0 bg-white px-5 py-3 rounded-xl border border-border/70 shadow-sm">
                  <span className="text-xs font-bold text-nopal block">R&D Universitaire</span>
                  <span className="text-[11px] text-muted-foreground">Formulation validée</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. Séparateur Décoratif Organique */}
        {/* ========================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
          <div className="relative rounded-3xl overflow-hidden h-40 sm:h-52 w-full border border-border/60 shadow-sm">
            <img
              src={hydrogelSeparatorSrc}
              alt="Goutte d'hydrogel sur cladode de figuier de Barbarie"
              loading="lazy"
              className="w-full h-full object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-linen/80 via-transparent to-linen/80 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
              <span className="font-fraunces italic text-lg sm:text-xl text-nopal/90 max-w-lg">
                « La nature détient les secrets d'un apaisement profond. »
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. Section 4 — Mode d'Utilisation */}
        {/* ========================================================= */}
        <section
          id="utilisation"
          className="py-20 lg:py-28 bg-hydrogel/50 border-y border-border/60"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-cladode">
                Protocole Simple
              </span>
              <h2 className="font-fraunces text-3xl sm:text-4xl text-nopal font-bold mt-2 mb-4">
                Mode d'Utilisation
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                4 étapes simples pour une efficacité et un confort optimaux.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Illustrative Image: Patch application on arm */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-nature border border-white bg-white">
                  <img
                    src={utilisationPatchSrc}
                    alt="Application d'un patch hydrogel PatchNature sur la peau"
                    loading="lazy"
                    className="w-full h-[360px] sm:h-[440px] object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/80 text-xs font-medium text-nopal shadow-sm">
                    Application douce, indolore et adaptée à toutes les zones sensibles.
                  </div>
                </div>
              </div>

              {/* 4 Sequenced Steps (01 -> 04) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Step 01 */}
                <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-start gap-5 hover:border-cladode/50 transition-colors">
                  <span className="font-fraunces font-bold text-3xl text-cladode shrink-0 leading-none">
                    01
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-nopal mb-1">Nettoyer</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Nettoyer et sécher délicatement la zone cutanée concernée avant l'application.
                    </p>
                  </div>
                </div>

                {/* Step 02 */}
                <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-start gap-5 hover:border-cladode/50 transition-colors">
                  <span className="font-fraunces font-bold text-3xl text-cladode shrink-0 leading-none">
                    02
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-nopal mb-1">Appliquer</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Retirer le film protecteur et placer le patch hydrogel directement sur la peau.
                    </p>
                  </div>
                </div>

                {/* Step 03 */}
                <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-start gap-5 hover:border-cladode/50 transition-colors">
                  <span className="font-fraunces font-bold text-3xl text-cladode shrink-0 leading-none">
                    03
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-nopal mb-1">Laisser agir</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Respecter la durée recommandée indiquée sur l'emballage pour une action
                      apaisante continue.
                    </p>
                  </div>
                </div>

                {/* Step 04 */}
                <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-start gap-5 hover:border-cladode/50 transition-colors">
                  <span className="font-fraunces font-bold text-3xl text-cladode shrink-0 leading-none">
                    04
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-nopal mb-1">Retirer</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Retirer délicatement le patch après utilisation. Jeter après usage unique.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. Section 5 — Notre Vision */}
        {/* ========================================================= */}
        <section className="py-20 lg:py-28 bg-nopal text-linen relative overflow-hidden">
          {/* Subtle background radial tint */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cladode/20 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-aloe mb-6">
              Engagement & Innovation
            </span>

            <blockquote className="font-fraunces text-2xl sm:text-3xl lg:text-4xl font-normal leading-relaxed text-linen/95 mb-8">
              « Développer de nouvelles solutions pour les soins de la peau en valorisant les
              ressources végétales disponibles localement. »
            </blockquote>

            <div className="w-16 h-0.5 bg-aloe/60 mx-auto mb-6" />

            <p className="text-sm text-linen/70 uppercase tracking-wider font-medium">
              L'ambition PatchNature — Recherche, Santé et Responsabilité
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. Section 6 — Espace Pro / Formulaire de Demande B2B */}
        {/* ========================================================= */}
        {settings.show_inquiry_form && (
          <section id="contact-pro" className="py-20 lg:py-28 bg-linen border-b border-border/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left: Professional Context & Pharmacist Image */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cladode">
                      Partenariat & Distribution
                    </span>
                    <h2 className="font-fraunces text-3xl sm:text-4xl text-nopal font-bold mt-2 mb-4">
                      Espace Professionnel
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      Vous êtes pharmacien d'officine, grossiste-répartiteur ou professionnel de
                      santé ? Échangez directement avec notre équipe de développement pour obtenir des
                      échantillons ou des informations techniques.
                    </p>
                  </div>

                  <div className="rounded-2xl overflow-hidden shadow-nature border border-border">
                    <img
                      src={pharmacieProSrc}
                      alt="Pharmacienne disposant des produits naturels sur étagère en officine"
                      loading="lazy"
                      className="w-full h-[260px] sm:h-[320px] object-cover"
                    />
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-3">
                    <h4 className="text-sm font-bold text-nopal flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cladode" />
                      Engagements pour les officines
                    </h4>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cladode shrink-0" />
                        <span>Dossier technique et documentation scientifique sur demande</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cladode shrink-0" />
                        <span>Mise à disposition de packs découverte et échantillons</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cladode shrink-0" />
                        <span>Réactivité et disponibilité sur l'ensemble des 58 wilayas</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right: B2B Inquiry Form */}
                <div className="lg:col-span-7">
                  <div className="bg-white rounded-3xl p-8 sm:p-10 border border-border shadow-nature-lg">
                    <h3 className="font-fraunces text-2xl text-nopal font-bold mb-2">
                      Demande de renseignements ou d'échantillons
                    </h3>
                    <p className="text-sm text-muted-foreground mb-8">
                      Remplissez ce formulaire pour être recontacté par notre équipe dans les
                      meilleurs délais.
                    </p>

                    <InquiryForm />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 9. Section 7 — Contact */}
        {/* ========================================================= */}
        <section id="contact" className="py-16 lg:py-24 bg-hydrogel/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-cladode">
              Restons en Contact
            </span>
            <h2 className="font-fraunces text-3xl sm:text-4xl text-nopal font-bold mt-2 mb-4">
              Une question sur PatchNature ?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-10 max-w-xl mx-auto">
              Pour en savoir plus sur notre produit, échanger sur nos travaux de recherche ou
              suivre l'évolution du projet, n'hésitez pas à nous contacter.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Phone */}
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:border-cladode hover:shadow-nature transition-all text-center flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-3 group-hover:bg-cladode group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-xs text-muted-foreground">Téléphone</span>
                <span className="text-sm font-bold text-nopal mt-1">{settings.phone}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${settings.email}`}
                className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:border-cladode hover:shadow-nature transition-all text-center flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-3 group-hover:bg-cladode group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-xs text-muted-foreground">Email</span>
                <span className="text-xs font-bold text-nopal mt-1 break-all">
                  {settings.email}
                </span>
              </a>

              {/* Facebook */}
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:border-cladode hover:shadow-nature transition-all text-center flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-3 group-hover:bg-cladode group-hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </div>
                <span className="text-xs text-muted-foreground">Facebook</span>
                <span className="text-sm font-bold text-nopal mt-1">PatchNature</span>
              </a>

              {/* Instagram */}
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:border-cladode hover:shadow-nature transition-all text-center flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-3 group-hover:bg-cladode group-hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="text-xs text-muted-foreground">Instagram</span>
                <span className="text-sm font-bold text-nopal mt-1">@patch_nature</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* 10. Footer */}
      {/* ========================================================= */}
      <footer className="bg-nopal text-linen py-12 border-t border-aloe/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt="PatchNature"
                className="w-10 h-10 object-contain rounded-lg bg-white p-0.5"
              />
              <div>
                <span className="font-fraunces text-xl font-bold tracking-tight text-white block">
                  PatchNature
                </span>
                <span className="text-xs text-aloe">Soin cutané naturel à l'hydrogel</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-linen/80">
              <button onClick={() => scrollTo("produit")} className="hover:text-white">
                Produit
              </button>
              <button onClick={() => scrollTo("atouts")} className="hover:text-white">
                Atouts
              </button>
              <button onClick={() => scrollTo("utilisation")} className="hover:text-white">
                Mode d'emploi
              </button>
              {settings.show_inquiry_form && (
                <button onClick={() => scrollTo("contact-pro")} className="hover:text-white">
                  Espace Pro
                </button>
              )}
              <button onClick={() => scrollTo("contact")} className="hover:text-white">
                Contact
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-linen/70">
            <div>© 2026 PatchNature. Tous droits réservés. Innovation développée en Algérie.</div>

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
    </div>
  );
}

// B2B Inquiry Form Component
function InquiryForm() {
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [wilaya, setWilaya] = useState("16 - Alger");
  const [indicativeQuantity, setIndicativeQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const cleanName = fullName.trim().slice(0, 100);
    const cleanPhone = phone.trim().replace(/[\s.-]/g, "").slice(0, 20);
    const cleanEmail = email.trim().slice(0, 100);
    const cleanOrg = organization.trim().slice(0, 150);
    const cleanMsg = message.trim().slice(0, 1000);

    if (!cleanName || !cleanPhone || !wilaya.trim()) {
      toast.error("Veuillez remplir votre nom, téléphone et wilaya.");
      return;
    }

    // Phone validation (Algerian mobile/fixed format or general international)
    const phoneRegex = /^(?:(?:\+|00)213|0)?[567][0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 9) {
      toast.error("Veuillez saisir un numéro de téléphone valide (ex: 0775691557 ou 05/06/07...).");
      return;
    }

    // Email validation if entered
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Veuillez saisir une adresse email valide.");
      return;
    }

    // Client-side rate limiting (cooldown of 30 seconds)
    const lastSubmit = sessionStorage.getItem("patchnature_last_inquiry");
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit, 10) < 30000) {
      toast.error("Veuillez patienter 30 secondes avant d'envoyer une nouvelle demande.");
      return;
    }

    setSubmitting(true);
    try {
      await submitInquiry({
        full_name: cleanName,
        organization_name: cleanOrg || null,
        phone: cleanPhone,
        email: cleanEmail || null,
        wilaya,
        indicative_quantity: indicativeQuantity ? parseInt(indicativeQuantity, 10) : null,
        message: cleanMsg || null,
      });

      sessionStorage.setItem("patchnature_last_inquiry", now.toString());
      setSubmitted(true);
      toast.success("Votre demande a été transmise avec succès !");
    } catch (err) {
      console.error("Erreur lors de la transmission de la demande:", err);
      toast.error("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-hydrogel text-cladode flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="font-fraunces text-2xl font-bold text-nopal mb-2">Demande envoyée !</h4>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Merci pour votre intérêt envers PatchNature. Notre équipe examinera votre demande et
          prendra contact avec vous dans les plus brefs délais.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFullName("");
            setOrganization("");
            setPhone("");
            setEmail("");
            setIndicativeQuantity("");
            setMessage("");
          }}
          className="btn-outline-nature text-sm px-6 py-2.5 rounded-lg"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold text-nopal mb-1.5">
            Nom et Prénom <span className="text-destructive">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ex. Dr. Karim Benali"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="organization" className="block text-xs font-semibold text-nopal mb-1.5">
            Pharmacie ou Établissement
          </label>
          <input
            id="organization"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Ex. Pharmacie de l'Espoir"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-nopal mb-1.5">
            Numéro de téléphone <span className="text-destructive">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07XX XX XX XX"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-nopal mb-1.5">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@pharmacie.dz"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="wilaya" className="block text-xs font-semibold text-nopal mb-1.5">
            Wilaya <span className="text-destructive">*</span>
          </label>
          <select
            id="wilaya"
            required
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent cursor-pointer"
          >
            {WILAYAS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="indicativeQuantity"
            className="block text-xs font-semibold text-nopal mb-1.5"
          >
            Quantité indicative estimée (boîtes)
          </label>
          <input
            id="indicativeQuantity"
            type="number"
            min="1"
            value={indicativeQuantity}
            onChange={(e) => setIndicativeQuantity(e.target.value)}
            placeholder="Ex. 50"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-nopal mb-1.5">
          Message ou demande spécifique
        </label>
        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Précisez votre demande : commande d'échantillons, questions techniques, etc."
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full btn-cta py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transmission en cours...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Envoyer ma demande de renseignements</span>
          </>
        )}
      </button>
    </form>
  );
}
