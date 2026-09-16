import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Settings = {
  id: number;
  phone: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  show_inquiry_form: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  id: 1,
  phone: "0775691557",
  email: "contact.patchnature@gmail.com",
  facebook_url: "https://facebook.com/PatchNature",
  instagram_url: "https://instagram.com/patch_nature",
  show_inquiry_form: true,
};

/**
 * Enregistre les paramètres directement dans les colonnes SQL de la table `settings`.
 * Plus de stockage JSON `content` — toutes les valeurs vont dans leurs colonnes respectives.
 */
export async function saveSettingsToSupabase(patch: Partial<Settings>): Promise<void> {
  const payload: Record<string, any> = {};

  if (patch.phone !== undefined) payload.phone = patch.phone;
  if (patch.email !== undefined) payload.email = patch.email;
  if (patch.facebook_url !== undefined) payload.facebook_url = patch.facebook_url;
  if (patch.instagram_url !== undefined) payload.instagram_url = patch.instagram_url;
  if (patch.show_inquiry_form !== undefined) payload.show_inquiry_form = patch.show_inquiry_form;

  if (Object.keys(payload).length === 0) return;

  const { error } = await supabase
    .from("settings")
    .update(payload)
    .eq("id", 1);

  if (error) {
    console.error("[saveSettingsToSupabase] Erreur:", error);
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
        setSettings({
          id: 1,
          phone: data.phone || DEFAULT_SETTINGS.phone,
          email: data.email || DEFAULT_SETTINGS.email,
          facebook_url: data.facebook_url || DEFAULT_SETTINGS.facebook_url,
          instagram_url: data.instagram_url || DEFAULT_SETTINGS.instagram_url,
          show_inquiry_form:
            data.show_inquiry_form !== undefined
              ? Boolean(data.show_inquiry_form)
              : DEFAULT_SETTINGS.show_inquiry_form,
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

            setSettings((prev) => ({
              ...prev,
              phone: row.phone || prev.phone,
              email: row.email || prev.email,
              facebook_url: row.facebook_url || prev.facebook_url,
              instagram_url: row.instagram_url || prev.instagram_url,
              show_inquiry_form:
                row.show_inquiry_form !== undefined
                  ? Boolean(row.show_inquiry_form)
                  : prev.show_inquiry_form,
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
