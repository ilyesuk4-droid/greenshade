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

type Ctx = {
  settings: Settings;
  loading: boolean;
  refresh: () => Promise<void>;
  updateLocal: (patch: Partial<Settings>) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data, error } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
      if (!error && data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...(data as Partial<Settings>),
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
            setSettings((prev) => ({
              ...prev,
              ...(payload.new as Partial<Settings>),
            }));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <StoreContext.Provider
      value={{
        settings,
        loading,
        refresh,
        updateLocal: (patch) =>
          setSettings((s) => ({ ...s, ...patch })),
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
