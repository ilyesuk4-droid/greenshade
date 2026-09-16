import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Settings = {
  id: number;
  phone: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  show_inquiry_form: boolean;
  logo_url: string | null;
  hero_image_url: string | null;
  secondary_image_url: string | null;
  hero_bg_url: string | null;
  cactus_produit_url: string | null;
  hydrogel_separator_url: string | null;
  utilisation_patch_url: string | null;
  pharmacie_pro_url: string | null;
};

export const DEFAULT_SETTINGS: Settings = {
  id: 1,
  phone: "0775691557",
  email: "contact.patchnature@gmail.com",
  facebook_url: "https://facebook.com/PatchNature",
  instagram_url: "https://instagram.com/patch_nature",
  show_inquiry_form: true,
  logo_url: null,
  hero_image_url: null,
  secondary_image_url: null,
  hero_bg_url: null,
  cactus_produit_url: null,
  hydrogel_separator_url: null,
  utilisation_patch_url: null,
  pharmacie_pro_url: null,
};

/**
 * Enregistre les paramètres de manière résiliente :
 * Met à jour à la fois les colonnes SQL existantes et le stockage JSON 'content'
 * pour garantir le fonctionnement même si certaines colonnes n'existent pas dans le schéma SQL.
 */
export async function saveSettingsToSupabase(patch: Partial<Settings>): Promise<void> {
  // 1. Récupérer le 'content' existant
  const { data: sData } = await supabase
    .from("settings")
    .select("content")
    .eq("id", 1)
    .maybeSingle();

  const currentContent =
    sData?.content && typeof sData.content === "object"
      ? (sData.content as Record<string, any>)
      : {};

  // 2. Fusionner les nouveaux paramètres
  const updatedContent = {
    ...currentContent,
    ...patch,
  };

  // 3. Préparer le payload avec les colonnes supportées
  const payload: Record<string, any> = {
    content: updatedContent,
  };

  if (patch.phone !== undefined) payload.phone = patch.phone;
  if (patch.facebook_url !== undefined) payload.facebook_url = patch.facebook_url;
  if (patch.instagram_url !== undefined) payload.instagram_url = patch.instagram_url;

  const { error } = await supabase
    .from("settings")
    .update(payload)
    .eq("id", 1);

  if (error) {
    throw error;
  }
}

type Ctx = {
  settings: Settings;
  loading: boolean;
  refresh: () => Promise<void>;
  updateLocal: (patch: Partial<Settings>) => void;
  saveSettings: (patch: Partial<Settings>) => Promise<void>;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!error && data) {
        const c =
          data.content && typeof data.content === "object"
            ? (data.content as Record<string, any>)
            : {};

        setSettings({
          id: 1,
          phone: data.phone || c.phone || DEFAULT_SETTINGS.phone,
          facebook_url: data.facebook_url || c.facebook_url || DEFAULT_SETTINGS.facebook_url,
          instagram_url: data.instagram_url || c.instagram_url || DEFAULT_SETTINGS.instagram_url,
          email: c.email || data.email || DEFAULT_SETTINGS.email,
          show_inquiry_form:
            c.show_inquiry_form !== undefined
              ? Boolean(c.show_inquiry_form)
              : data.show_inquiry_form !== undefined
              ? Boolean(data.show_inquiry_form)
              : DEFAULT_SETTINGS.show_inquiry_form,
          logo_url: c.logo_url ?? data.logo_url ?? null,
          hero_image_url: c.hero_image_url ?? data.hero_image_url ?? null,
          secondary_image_url: c.secondary_image_url ?? data.secondary_image_url ?? null,
          hero_bg_url: c.hero_bg_url ?? data.hero_bg_url ?? null,
          cactus_produit_url: c.cactus_produit_url ?? data.cactus_produit_url ?? null,
          hydrogel_separator_url: c.hydrogel_separator_url ?? data.hydrogel_separator_url ?? null,
          utilisation_patch_url: c.utilisation_patch_url ?? data.utilisation_patch_url ?? null,
          pharmacie_pro_url: c.pharmacie_pro_url ?? data.pharmacie_pro_url ?? null,
        });
      }
    } catch (e) {
      console.warn("Failed to fetch settings from Supabase, using defaults:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();

    const channel = supabase
      .channel("patchnature-settings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings" },
        (payload) => {
          if (payload.new) {
            const row = payload.new as any;
            const c =
              row.content && typeof row.content === "object"
                ? (row.content as Record<string, any>)
                : {};

            setSettings((prev) => ({
              ...prev,
              phone: row.phone || c.phone || prev.phone,
              facebook_url: row.facebook_url || c.facebook_url || prev.facebook_url,
              instagram_url: row.instagram_url || c.instagram_url || prev.instagram_url,
              email: c.email || prev.email,
              show_inquiry_form:
                c.show_inquiry_form !== undefined
                  ? Boolean(c.show_inquiry_form)
                  : prev.show_inquiry_form,
              logo_url: c.logo_url !== undefined ? c.logo_url : prev.logo_url,
              hero_image_url: c.hero_image_url !== undefined ? c.hero_image_url : prev.hero_image_url,
              secondary_image_url:
                c.secondary_image_url !== undefined ? c.secondary_image_url : prev.secondary_image_url,
              hero_bg_url: c.hero_bg_url !== undefined ? c.hero_bg_url : prev.hero_bg_url,
              cactus_produit_url:
                c.cactus_produit_url !== undefined ? c.cactus_produit_url : prev.cactus_produit_url,
              hydrogel_separator_url:
                c.hydrogel_separator_url !== undefined
                  ? c.hydrogel_separator_url
                  : prev.hydrogel_separator_url,
              utilisation_patch_url:
                c.utilisation_patch_url !== undefined
                  ? c.utilisation_patch_url
                  : prev.utilisation_patch_url,
              pharmacie_pro_url:
                c.pharmacie_pro_url !== undefined ? c.pharmacie_pro_url : prev.pharmacie_pro_url,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSaveSettings = async (patch: Partial<Settings>) => {
    await saveSettingsToSupabase(patch);
    await refresh();
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        loading,
        refresh,
        updateLocal: (patch) => setSettings((s) => ({ ...s, ...patch })),
        saveSettings: handleSaveSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
