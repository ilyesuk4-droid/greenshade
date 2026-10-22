import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { CartProvider, useCart } from "@/hooks/use-cart";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { siteConfig } from "@/config/site";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold font-fraunces text-nopal">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-encre">Page non trouvée</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="mt-6 inline-block btn-cta rounded-lg px-6 py-2.5 text-sm">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-encre font-fraunces">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 btn-cta rounded-lg px-6 py-2.5 text-sm cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${siteConfig.brandName} — Cosmétiques Naturels | ${siteConfig.tagline}` },
      {
        name: "description",
        content: `${siteConfig.brandName} — ${siteConfig.headline}. Soins naturels pour visage et corps, déodorants sans alcool ni sels d'aluminium. Efficacité garantie.`,
      },
      { property: "og:title", content: `${siteConfig.brandName} — Cosmétiques Naturels` },
      {
        property: "og:description",
        content: `${siteConfig.brandName} — ${siteConfig.headline}. ${siteConfig.tagline}.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: `${siteConfig.brandName} — Cosmétiques Naturels` },
      {
        name: "twitter:description",
        content: `${siteConfig.brandName} — ${siteConfig.headline}. ${siteConfig.tagline}.`,
      },
      { property: "og:image", content: siteConfig.logoPath },
      { name: "twitter:image", content: siteConfig.logoPath },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: siteConfig.faviconPath },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;500;600;700;800&family=Work+Sans:wght@300;400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-linen text-encre selection:bg-aloe selection:text-nopal">
      <Navbar onOpenCart={() => setCartOpen(true)} cartItemCount={itemCount} />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toaster position="bottom-right" richColors duration={3000} />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </QueryClientProvider>
  );
}
