import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function FloatingWhatsApp() {
  const url = siteConfig.whatsappUrl("Bonjour GREEN SHADE, je souhaite des renseignements sur vos produits.");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-emerald-300"
    >
      <Phone className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2">
        Discuter sur WhatsApp
      </span>
    </a>
  );
}
