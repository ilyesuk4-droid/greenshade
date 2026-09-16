import { supabase } from "@/integrations/supabase/client";

export type Inquiry = {
  id: string;
  created_at: string;
  full_name: string;
  organization_name: string | null;
  phone: string;
  email: string | null;
  wilaya: string;
  indicative_quantity: number | null;
  message: string | null;
  status: string;
};

const LOCAL_STORAGE_BACKUP_KEY = "patchnature_inquiries_backup";

function getLocalBackup(): Inquiry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBackup(inquiries: Inquiry[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(inquiries.slice(0, 100)));
  } catch (e) {
    console.warn("LocalStorage backup failed:", e);
  }
}

/**
 * Charge toutes les demandes B2B depuis la table `inquiries` de Supabase.
 * Utilise localStorage comme cache de secours uniquement en cas d'échec réseau.
 */
export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchInquiries] Erreur Supabase:", error);
    // En cas d'erreur réseau, retourner le cache local
    const backup = getLocalBackup();
    if (backup.length > 0) {
      console.warn("[fetchInquiries] Utilisation du cache local de secours");
      return backup;
    }
    // Propager l'erreur pour que l'UI puisse l'afficher
    throw error;
  }

  const inquiries = (data ?? []) as Inquiry[];
  saveLocalBackup(inquiries);
  return inquiries;
}

/**
 * Enregistre une nouvelle demande B2B dans la table `inquiries`.
 */
export async function submitInquiry(inquiryData: {
  full_name: string;
  organization_name?: string | null;
  phone: string;
  email?: string | null;
  wilaya: string;
  indicative_quantity?: number | null;
  message?: string | null;
}): Promise<Inquiry> {
  const payload = {
    full_name: inquiryData.full_name,
    organization_name: inquiryData.organization_name || null,
    phone: inquiryData.phone,
    email: inquiryData.email || null,
    wilaya: inquiryData.wilaya,
    indicative_quantity: inquiryData.indicative_quantity ?? null,
    message: inquiryData.message || null,
    status: "nouveau",
  };

  const { data, error } = await supabase
    .from("inquiries")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("[submitInquiry] Erreur Supabase:", error);
    throw error;
  }

  // Mettre à jour le cache local
  const local = getLocalBackup();
  saveLocalBackup([data as Inquiry, ...local]);

  return data as Inquiry;
}

/**
 * Mise à jour du statut d'une demande
 */
export async function updateInquiryStatus(id: string, newStatus: string): Promise<void> {
  const { error } = await supabase
    .from("inquiries")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    console.error("[updateInquiryStatus] Erreur Supabase:", error);
    throw error;
  }

  // Mettre à jour la copie locale
  const local = getLocalBackup().map((i) => (i.id === id ? { ...i, status: newStatus } : i));
  saveLocalBackup(local);
}

/**
 * Suppression d'une demande
 */
export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await supabase
    .from("inquiries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteInquiry] Erreur Supabase:", error);
    throw error;
  }

  const local = getLocalBackup().filter((i) => i.id !== id);
  saveLocalBackup(local);
}

/**
 * Vérification diagnostique de l'état du stockage des demandes
 */
export async function checkInquiriesStorageHealth(): Promise<{
  ok: boolean;
  mode: "table" | "offline";
  message: string;
  count: number;
  latency: number;
}> {
  const start = performance.now();

  try {
    const { data, error, count } = await supabase
      .from("inquiries")
      .select("id", { count: "exact" })
      .limit(1);

    const latency = Math.round(performance.now() - start);

    if (!error) {
      return {
        ok: true,
        mode: "table",
        message: `Table SQL 'inquiries' opérationnelle (${count ?? data?.length ?? 0} demandes)`,
        count: count ?? data?.length ?? 0,
        latency,
      };
    }

    return {
      ok: false,
      mode: "offline",
      message: `Erreur d'accès à la table inquiries: ${error.message}`,
      count: 0,
      latency,
    };
  } catch (err: any) {
    return {
      ok: false,
      mode: "offline",
      message: `Erreur de connexion: ${err?.message || "Inconnue"}`,
      count: getLocalBackup().length,
      latency: Math.round(performance.now() - start),
    };
  }
}
