import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Phone, Mail, Instagram, Send, Calendar, MapPin, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Veuillez remplir votre nom et votre message.");
      return;
    }

    setSubmitting(true);

    // TODO: connect contact form to backend endpoint
    setTimeout(() => {
      setSubmitting(false);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      toast.success("Votre message a été envoyé avec succès ! Nous vous répondrons rapidement.");
    }, 600);
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-linen flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-cladode">
            Service Client & Informations
          </span>
          <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-nopal mt-2 mb-4">
            Contactez GREEN SHADE
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Une question sur nos déodorants naturels ou nos commandes ? Écrivez-nous ou retrouvez-nous sur nos réseaux.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {/* WhatsApp */}
          <a
            href={siteConfig.whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:border-cladode hover:shadow-nature transition-all text-center flex flex-col items-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground">WhatsApp</span>
            <span className="text-sm font-bold text-nopal mt-1">
              {siteConfig.contact.whatsappDisplay}
            </span>
          </a>

          {/* Instagram */}
          <a
            href={siteConfig.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:border-cladode hover:shadow-nature transition-all text-center flex flex-col items-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-3 group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground">Instagram</span>
            <span className="text-sm font-bold text-nopal mt-1">
              @{siteConfig.social.instagram.handle}
            </span>
          </a>

          {/* TikTok */}
          <a
            href={siteConfig.social.tiktok.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:border-cladode hover:shadow-nature transition-all text-center flex flex-col items-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-3 group-hover:bg-black group-hover:text-white transition-colors">
              <span className="font-bold text-sm">TT</span>
            </div>
            <span className="text-xs text-muted-foreground">TikTok</span>
            <span className="text-sm font-bold text-nopal mt-1">
              @{siteConfig.social.tiktok.handle}
            </span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="bg-white p-6 rounded-2xl border border-border/80 shadow-sm hover:border-cladode hover:shadow-nature transition-all text-center flex flex-col items-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-hydrogel text-cladode flex items-center justify-center mb-3 group-hover:bg-cladode group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground">Email</span>
            <span className="text-xs font-bold text-nopal mt-1 break-all">
              {siteConfig.contact.email}
            </span>
          </a>
        </div>

        {/* Expo Sétif Banner Card & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Expo Card */}
          <div className="lg:col-span-5 bg-nopal text-linen rounded-3xl p-8 shadow-nature space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-aloe font-bold block mb-1">
                Salon Professionnel
              </span>
              <h3 className="font-fraunces text-2xl font-bold text-white">
                {siteConfig.expo.name}
              </h3>
            </div>

            <div className="space-y-4 text-sm text-linen/90">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-aloe shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Dates :</span>
                  <span>{siteConfig.expo.dates}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-aloe shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Lieu :</span>
                  <span>{siteConfig.expo.city}, Algérie</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-linen/70 pt-4 border-t border-white/10 leading-relaxed">
              Venez tester directement nos fragrances et échanger avec notre équipe fondatrice au salon Cosmenex Expo de Sétif !
            </p>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-border shadow-sm">
            <h3 className="font-fraunces text-2xl font-bold text-nopal mb-2">
              Envoyez-nous un message
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Remplissez ce formulaire et nous vous recontacterons dans les plus brefs délais.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contactName" className="block text-xs font-semibold text-nopal mb-1">
                  Nom et prénom <span className="text-destructive">*</span>
                </label>
                <input
                  id="contactName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Karim Mansouri"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-xs font-semibold text-nopal mb-1">
                    Adresse email
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-xs font-semibold text-nopal mb-1">
                    Téléphone
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XX XX XX XX"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactMessage" className="block text-xs font-semibold text-nopal mb-1">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="contactMessage"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Votre question, demande de devis ou remarque..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-cta py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Envoyer mon message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
