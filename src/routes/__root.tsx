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
import { StoreProvider } from "@/lib/store-context";

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
          className="mt-6 btn-cta rounded-lg px-6 py-2.5 text-sm"
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
      { title: "PatchNature — Patch Naturel Anti-inflammatoire à l'Hydrogel de Cladodes" },
      {
        name: "description",
        content: "Une solution innovante pour les soins de la peau, associant un extrait de cladodes de figuier de Barbarie à la technologie hydrogel. Innovation développée en Algérie.",
      },
      { property: "og:title", content: "PatchNature — Patch Naturel Anti-inflammatoire" },
      {
        property: "og:description",
        content: "Soin innovant de la peau à base d'hydrogel de cladodes de figuier de Barbarie. Conçu et formulé en Algérie.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "PatchNature — Patch Naturel Anti-inflammatoire" },
      {
        name: "twitter:description",
        content: "Soin innovant de la peau à base d'hydrogel de cladodes de figuier de Barbarie. Conçu et formulé en Algérie.",
      },
      { property: "og:image", content: "/patchnature-box.png" },
      { name: "twitter:image", content: "/patchnature-box.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Outlet />
        <Toaster position="bottom-right" richColors duration={3000} />
      </StoreProvider>
    </QueryClientProvider>
  );
}
