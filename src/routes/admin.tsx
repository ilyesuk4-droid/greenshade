import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Inbox,
  Settings as SettingsIcon,
  Image as ImageIcon,
  LogOut,
  Loader2,
  Search,
  Lock,
  Trash2,
  Home,
  CheckCircle2,
  Clock,
  Building2,
  Phone,
  Mail,
  MapPin,
  Upload,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStore, type Settings } from "@/lib/store-context";
import { WILAYAS } from "@/lib/wilayas";

// Fallback images
import heroBg from "@/assets/hero-bg.png";
import cactusProduit from "@/assets/cactus-produit.png";
import utilisationPatch from "@/assets/utilisation-patch.jpg";
import pharmaciePro from "@/assets/pharmacie-pro.jpg";
import hydrogelSeparator from "@/assets/hydrogel-separator.jpg";
import defaultLogo from "@/assets/patchnature-logo.jpeg";
import defaultPackaging from "@/assets/patchnature-packaging.jpg";
import defaultBox from "@/assets/patchnature-box.jpg";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const ADMIN_PASSWORD = "patchnature2026";
const AUTH_KEY = "patchnature_admin_auth";

type Inquiry = {
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

const STATUSES = [
  { id: "nouveau", label: "Nouveau", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { id: "contacté", label: "Contacté", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "traité", label: "Traité", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { id: "annulé", label: "Annulé", color: "bg-rose-100 text-rose-800 border-rose-200" },
];

const fmtDate = (d: string) => {
  try {
    return new Date(d).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return d;
  }
};

/* ---------- Password Gate ---------- */
function PasswordGate({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      toast.success("Connexion réussie");
      onOk();
    } else {
      setErr("Code d'accès incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nopal p-4">
      <form
        onSubmit={submit}
        className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl w-full max-w-sm border border-aloe/30 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-hydrogel text-nopal flex items-center justify-center mb-4 shadow-sm">
            <Lock className="w-7 h-7 text-cladode" />
          </div>
          <h1 className="font-fraunces text-2xl font-bold text-nopal">PatchNature Admin</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Espace d'administration réservé
          </p>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{err}</span>
          </div>
        )}

        <div className="mb-5">
          <label htmlFor="adminPw" className="block text-xs font-semibold text-nopal mb-1.5">
            Code d'accès
          </label>
          <div className="relative">
            <input
              id="adminPw"
              type={showPassword ? "text" : "password"}
              autoFocus
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setErr("");
              }}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-linen/50 text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-nopal cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-cta py-3 rounded-lg text-sm font-semibold cursor-pointer"
        >
          Connexion
        </button>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-nopal">
            ← Retourner au site vitrine
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ---------- Main Admin Page Component ---------- */
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "inquiries" | "images" | "settings">("overview");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { settings, refresh: refreshStore } = useStore();

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setInquiries(data as Inquiry[]);
      } else if (error) {
        console.error("Erreur de chargement des demandes:", error);
      }
    } catch (err) {
      console.error("Erreur de chargement des demandes:", err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (authed) {
      loadInquiries();
    }
  }, [authed]);

  if (!authed) {
    return <PasswordGate onOk={() => setAuthed(true)} />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    toast.success("Déconnexion réussie");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-linen/50 text-encre">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-nopal text-linen px-4 py-3 flex items-center justify-between border-b border-aloe/20 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
            <img
              src={settings.logo_url || defaultLogo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-fraunces font-bold text-white text-base">
            PatchNature Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-nopal text-linen flex flex-col shrink-0 border-r border-aloe/20 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src={settings.logo_url || defaultLogo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-fraunces font-bold text-lg text-white leading-tight">
                PatchNature
              </span>
              <span className="text-[11px] text-aloe font-medium">Administration</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-linen/70 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 text-sm font-medium overflow-y-auto">
          <button
            onClick={() => {
              setActiveTab("overview");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
              activeTab === "overview"
                ? "bg-cladode text-white font-semibold"
                : "text-linen/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Vue d'ensemble</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("inquiries");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
              activeTab === "inquiries"
                ? "bg-cladode text-white font-semibold"
                : "text-linen/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4" />
              <span>Demandes B2B</span>
            </div>
            {inquiries.filter((i) => i.status === "nouveau").length > 0 && (
              <span className="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {inquiries.filter((i) => i.status === "nouveau").length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("images");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
              activeTab === "images"
                ? "bg-cladode text-white font-semibold"
                : "text-linen/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Images & Visuels</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("settings");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
              activeTab === "settings"
                ? "bg-cladode text-white font-semibold"
                : "text-linen/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Paramètres</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-linen/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Voir le site en direct</span>
            <ExternalLink className="w-3 h-3 ml-auto" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-300 hover:text-rose-100 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        {activeTab === "overview" && (
          <OverviewTab
            inquiries={inquiries}
            loading={loadingInquiries}
            onSelectInquiriesTab={() => setActiveTab("inquiries")}
          />
        )}

        {activeTab === "inquiries" && (
          <InquiriesTab
            inquiries={inquiries}
            loading={loadingInquiries}
            onRefresh={loadInquiries}
          />
        )}

        {activeTab === "images" && (
          <ImagesTab settings={settings} onRefreshSettings={refreshStore} />
        )}

        {activeTab === "settings" && (
          <SettingsTab settings={settings} onRefreshSettings={refreshStore} />
        )}
      </main>
    </div>
  );
}

/* ================================================================= */
/* 1. Overview Tab Component                                         */
/* ================================================================= */
function OverviewTab({
  inquiries,
  loading,
  onSelectInquiriesTab,
}: {
  inquiries: Inquiry[];
  loading: boolean;
  onSelectInquiriesTab: () => void;
}) {
  const total = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === "nouveau").length;
  const contactedCount = inquiries.filter((i) => i.status === "contacté").length;
  const completedCount = inquiries.filter((i) => i.status === "traité").length;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="font-fraunces text-3xl font-bold text-nopal">Vue d'ensemble</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Suivi des demandes professionnelles et indicateurs clés de PatchNature.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Demandes</span>
            <span className="p-2 rounded-lg bg-hydrogel text-nopal">
              <Inbox className="w-4 h-4" />
            </span>
          </div>
          <div className="font-fraunces text-3xl font-bold text-nopal mt-3">
            {loading ? "..." : total}
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Pharmacies et distributeurs
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Nouvelles demandes</span>
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="font-fraunces text-3xl font-bold text-emerald-700 mt-3">
            {loading ? "..." : newCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            En attente de premier contact
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700">En cours de contact</span>
            <span className="p-2 rounded-lg bg-blue-100 text-blue-800">
              <Phone className="w-4 h-4" />
            </span>
          </div>
          <div className="font-fraunces text-3xl font-bold text-blue-700 mt-3">
            {loading ? "..." : contactedCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Échantillons ou devis en cours
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700">Traitées avec succès</span>
            <span className="p-2 rounded-lg bg-purple-100 text-purple-800">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="font-fraunces text-3xl font-bold text-purple-700 mt-3">
            {loading ? "..." : completedCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Partenariats concrétisés
          </span>
        </div>
      </div>

      {/* Recent Inquiries Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-fraunces text-xl font-bold text-nopal">
              Dernières demandes reçues
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Les 5 demandes de renseignements les plus récentes
            </p>
          </div>
          <button
            onClick={onSelectInquiriesTab}
            className="text-xs font-semibold text-cladode hover:underline"
          >
            Voir toutes les demandes →
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Chargement...</span>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Aucune demande pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs font-semibold text-muted-foreground border-b border-border">
                <tr>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Nom</th>
                  <th className="pb-3">Établissement</th>
                  <th className="pb-3">Wilaya</th>
                  <th className="pb-3">Téléphone</th>
                  <th className="pb-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {inquiries.slice(0, 5).map((inq) => {
                  const statusObj =
                    STATUSES.find((s) => s.id === inq.status) || STATUSES[0];
                  return (
                    <tr key={inq.id} className="hover:bg-linen/40">
                      <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {fmtDate(inq.created_at)}
                      </td>
                      <td className="py-3 font-medium text-nopal whitespace-nowrap">
                        {inq.full_name}
                      </td>
                      <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {inq.organization_name || "—"}
                      </td>
                      <td className="py-3 text-xs whitespace-nowrap">{inq.wilaya}</td>
                      <td className="py-3 text-xs font-mono whitespace-nowrap">{inq.phone}</td>
                      <td className="py-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusObj.color}`}
                        >
                          {statusObj.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================= */
/* 2. Inquiries Tab Component                                        */
/* ================================================================= */
function InquiriesTab({
  inquiries,
  loading,
  onRefresh,
}: {
  inquiries: Inquiry[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchStatus = statusFilter === "all" || inq.status === statusFilter;
      const search = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        inq.full_name.toLowerCase().includes(search) ||
        (inq.organization_name && inq.organization_name.toLowerCase().includes(search)) ||
        inq.wilaya.toLowerCase().includes(search) ||
        inq.phone.includes(search) ||
        (inq.email && inq.email.toLowerCase().includes(search));
      return matchStatus && matchSearch;
    });
  }, [inquiries, searchTerm, statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("Statut mis à jour");
      onRefresh();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (err) {
      console.error(err);
      toast.error("Impossible de modifier le statut");
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Êtes-vous certain de vouloir supprimer cette demande ?")) return;
    try {
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (error) throw error;
      toast.success("Demande supprimée");
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Erreur de suppression");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-fraunces text-3xl font-bold text-nopal">Demandes B2B</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les demandes d'échantillons et contacts des professionnels de santé.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="btn-outline-nature text-xs px-4 py-2 rounded-lg flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, pharmacie, wilaya, téléphone..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-linen/40 focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="filterStatus" className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
            Statut :
          </label>
          <select
            id="filterStatus"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cladode cursor-pointer"
          >
            <option value="all">Tous les statuts ({inquiries.length})</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} ({inquiries.filter((i) => i.status === s.id).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-cladode" />
            <span>Chargement des demandes...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            Aucune demande ne correspond à vos critères.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs font-semibold text-muted-foreground bg-linen/50 border-b border-border">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Établissement</th>
                  <th className="p-4">Wilaya</th>
                  <th className="p-4">Qté estimée</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((inq) => {
                  return (
                    <tr key={inq.id} className="hover:bg-linen/30 transition-colors">
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {fmtDate(inq.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-nopal">{inq.full_name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                          <span className="font-mono">{inq.phone}</span>
                          {inq.email && <span>• {inq.email}</span>}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {inq.organization_name || "—"}
                      </td>
                      <td className="p-4 text-xs whitespace-nowrap">{inq.wilaya}</td>
                      <td className="p-4 text-xs font-semibold whitespace-nowrap">
                        {inq.indicative_quantity ? `${inq.indicative_quantity} boîtes` : "—"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={inq.status}
                          onChange={(e) => updateStatus(inq.id, e.target.value)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-cladode ${
                            STATUSES.find((s) => s.id === inq.status)?.color || ""
                          }`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            title="Voir les détails"
                            className="p-1.5 rounded-lg text-nopal hover:bg-hydrogel transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteInquiry(inq.id)}
                            title="Supprimer"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-xs text-muted-foreground">Détail de la demande</span>
                <h3 className="font-fraunces text-xl font-bold text-nopal mt-0.5">
                  {selectedInquiry.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-lg hover:bg-linen text-muted-foreground hover:text-encre"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Téléphone</span>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="font-semibold text-cladode hover:underline"
                >
                  {selectedInquiry.phone}
                </a>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Email</span>
                {selectedInquiry.email ? (
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="font-semibold text-cladode hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Non renseigné</span>
                )}
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Établissement</span>
                <span className="font-medium text-encre">
                  {selectedInquiry.organization_name || "Non renseigné"}
                </span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Wilaya</span>
                <span className="font-medium text-encre">{selectedInquiry.wilaya}</span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Quantité indicative</span>
                <span className="font-medium text-encre">
                  {selectedInquiry.indicative_quantity
                    ? `${selectedInquiry.indicative_quantity} boîtes`
                    : "Non spécifiée"}
                </span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Date de soumission</span>
                <span className="text-xs text-encre">{fmtDate(selectedInquiry.created_at)}</span>
              </div>
            </div>

            {selectedInquiry.message && (
              <div className="p-4 rounded-xl bg-linen border border-border">
                <span className="text-xs font-bold text-nopal block mb-1">Message :</span>
                <p className="text-xs text-encre whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Statut :</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => updateStatus(selectedInquiry.id, e.target.value)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer ${
                    STATUSES.find((s) => s.id === selectedInquiry.status)?.color || ""
                  }`}
                >
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="btn-cta text-xs px-5 py-2 rounded-lg"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================= */
/* 3. Images Tab Component (Supabase Storage Management)             */
/* ================================================================= */
function ImagesTab({
  settings,
  onRefreshSettings,
}: {
  settings: Settings;
  onRefreshSettings: () => Promise<void>;
}) {
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    field: "logo_url" | "hero_image_url" | "secondary_image_url" | "hero_bg_url" | "cactus_produit_url" | "hydrogel_separator_url" | "utilisation_patch_url" | "pharmacie_pro_url"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${field}-${Date.now()}.${ext}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to Supabase Storage bucket 'patchnature-assets'
      const { error: uploadError } = await supabase.storage
        .from("patchnature-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("patchnature-assets")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Update settings table
      const { error: updateError } = await supabase
        .from("settings")
        .update({ [field]: publicUrl })
        .eq("id", 1);

      if (updateError) throw updateError;

      await onRefreshSettings();
      toast.success("Image mise à jour avec succès !");
    } catch (err: any) {
      console.error("Erreur lors de l'upload d'image:", err);
      toast.error(
        err?.message ||
          "Erreur lors de l'upload. Assurez-vous que le bucket 'patchnature-assets' existe dans Supabase Storage."
      );
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  const handleResetToDefault = async (field: "logo_url" | "hero_image_url" | "secondary_image_url" | "hero_bg_url" | "cactus_produit_url" | "hydrogel_separator_url" | "utilisation_patch_url" | "pharmacie_pro_url") => {
    try {
      const { error } = await supabase
        .from("settings")
        .update({ [field]: null })
        .eq("id", 1);

      if (error) throw error;
      await onRefreshSettings();
      toast.success("Image réinitialisée vers l'asset d'origine");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de réinitialiser l'image");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-fraunces text-3xl font-bold text-nopal">Gestion des Visuels</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Modifiez dynamiquement le logo et les photos du packaging affichées sur le site.
        </p>
      </div>

      <div className="bg-hydrogel/50 p-4 rounded-2xl border border-aloe/40 text-xs text-nopal flex items-start gap-3">
        <Upload className="w-4 h-4 text-cladode shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Bucket Supabase Storage : `patchnature-assets`</span>
          <span>
            Les images téléversées sont hébergées sur le cloud Supabase Storage et mises à jour en
            temps réel sur le site sans redéploiement de code.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Logo */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cladode mb-2">
            Logo Officiel
          </span>
          <p className="text-xs text-muted-foreground mb-4">Header & Footer</p>

          <div className="w-32 h-32 rounded-2xl bg-linen border border-border/80 p-3 flex items-center justify-center mb-6 shadow-inner">
            <img
              src={settings.logo_url || defaultLogo}
              alt="Logo actuel"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="w-full space-y-2">
            <label className="btn-cta text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full">
              {uploadingField === "logo_url" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Remplacer le logo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingField !== null}
                onChange={(e) => handleUpload(e, "logo_url")}
              />
            </label>

            {settings.logo_url && (
              <button
                onClick={() => handleResetToDefault("logo_url")}
                className="text-xs text-muted-foreground hover:text-rose-600 transition-colors block mx-auto pt-1"
              >
                Rétablir le logo initial
              </button>
            )}
          </div>
        </div>

        {/* 2. Hero Product Photo (Box) */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cladode mb-2">
            Photo Principale (Hero)
          </span>
          <p className="text-xs text-muted-foreground mb-4">Boîte de 10 patchs</p>

          <div className="w-32 h-32 rounded-2xl bg-linen border border-border/80 p-3 flex items-center justify-center mb-6 shadow-inner">
            <img
              src={settings.hero_image_url || defaultBox}
              alt="Boîte héro actuelle"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="w-full space-y-2">
            <label className="btn-cta text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full">
              {uploadingField === "hero_image_url" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Remplacer l'image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingField !== null}
                onChange={(e) => handleUpload(e, "hero_image_url")}
              />
            </label>

            {settings.hero_image_url && (
              <button
                onClick={() => handleResetToDefault("hero_image_url")}
                className="text-xs text-muted-foreground hover:text-rose-600 transition-colors block mx-auto pt-1"
              >
                Rétablir l'image initiale
              </button>
            )}
          </div>
        </div>

        {/* 3. Secondary Photo (Packaging sachet) */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cladode mb-2">
            Photo Secondaire
          </span>
          <p className="text-xs text-muted-foreground mb-4">Sachet individuel</p>

          <div className="w-32 h-32 rounded-2xl bg-linen border border-border/80 p-3 flex items-center justify-center mb-6 shadow-inner">
            <img
              src={settings.secondary_image_url || defaultPackaging}
              alt="Sachet actuel"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="w-full space-y-2">
            <label className="btn-cta text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full">
              {uploadingField === "secondary_image_url" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Remplacer l'image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingField !== null}
                onChange={(e) => handleUpload(e, "secondary_image_url")}
              />
            </label>

            {settings.secondary_image_url && (
              <button
                onClick={() => handleResetToDefault("secondary_image_url")}
                className="text-xs text-muted-foreground hover:text-rose-600 transition-colors block mx-auto pt-1"
              >
                Rétablir l'image initiale
              </button>
            )}
          </div>
        </div>

        {/* 4. Hero Background */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cladode mb-2">
            Arrière-plan Principal
          </span>
          <p className="text-xs text-muted-foreground mb-4">Hero Background</p>

          <div className="w-32 h-32 rounded-2xl bg-linen border border-border/80 p-3 flex items-center justify-center mb-6 shadow-inner">
            <img
              src={settings.hero_bg_url || heroBg}
              alt="Background actuel"
              className="max-w-full max-h-full object-cover rounded-xl"
            />
          </div>

          <div className="w-full space-y-2">
            <label className="btn-cta text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full">
              {uploadingField === "hero_bg_url" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Remplacer l'image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingField !== null}
                onChange={(e) => handleUpload(e, "hero_bg_url")}
              />
            </label>
            {settings.hero_bg_url && (
              <button
                onClick={() => handleResetToDefault("hero_bg_url")}
                className="text-xs text-muted-foreground hover:text-rose-600 transition-colors block mx-auto pt-1"
              >
                Rétablir l'image initiale
              </button>
            )}
          </div>
        </div>

        {/* 5. Cactus Produit */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cladode mb-2">
            Macro Cactus
          </span>
          <p className="text-xs text-muted-foreground mb-4">Section Notre Produit</p>

          <div className="w-32 h-32 rounded-2xl bg-linen border border-border/80 p-3 flex items-center justify-center mb-6 shadow-inner">
            <img
              src={settings.cactus_produit_url || cactusProduit}
              alt="Cactus actuel"
              className="max-w-full max-h-full object-cover rounded-xl"
            />
          </div>

          <div className="w-full space-y-2">
            <label className="btn-cta text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full">
              {uploadingField === "cactus_produit_url" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Remplacer l'image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingField !== null}
                onChange={(e) => handleUpload(e, "cactus_produit_url")}
              />
            </label>
            {settings.cactus_produit_url && (
              <button
                onClick={() => handleResetToDefault("cactus_produit_url")}
                className="text-xs text-muted-foreground hover:text-rose-600 transition-colors block mx-auto pt-1"
              >
                Rétablir l'image initiale
              </button>
            )}
          </div>
        </div>

        {/* 6. Hydrogel Separator */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cladode mb-2">
            Séparateur Hydrogel
          </span>
          <p className="text-xs text-muted-foreground mb-4">Goutte d'eau</p>

          <div className="w-32 h-32 rounded-2xl bg-linen border border-border/80 p-3 flex items-center justify-center mb-6 shadow-inner">
            <img
              src={settings.hydrogel_separator_url || hydrogelSeparator}
              alt="Séparateur actuel"
              className="max-w-full max-h-full object-cover rounded-xl"
            />
          </div>

          <div className="w-full space-y-2">
            <label className="btn-cta text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full">
              {uploadingField === "hydrogel_separator_url" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Remplacer l'image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingField !== null}
                onChange={(e) => handleUpload(e, "hydrogel_separator_url")}
              />
            </label>
            {settings.hydrogel_separator_url && (
              <button
                onClick={() => handleResetToDefault("hydrogel_separator_url")}
                className="text-xs text-muted-foreground hover:text-rose-600 transition-colors block mx-auto pt-1"
              >
                Rétablir l'image initiale
              </button>
            )}
          </div>
        </div>

        {/* 7. Utilisation Patch */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cladode mb-2">
            Mode d'Utilisation
          </span>
          <p className="text-xs text-muted-foreground mb-4">Application sur la peau</p>

          <div className="w-32 h-32 rounded-2xl bg-linen border border-border/80 p-3 flex items-center justify-center mb-6 shadow-inner">
            <img
              src={settings.utilisation_patch_url || utilisationPatch}
              alt="Utilisation actuelle"
              className="max-w-full max-h-full object-cover rounded-xl"
            />
          </div>

          <div className="w-full space-y-2">
            <label className="btn-cta text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full">
              {uploadingField === "utilisation_patch_url" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Remplacer l'image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingField !== null}
                onChange={(e) => handleUpload(e, "utilisation_patch_url")}
              />
            </label>
            {settings.utilisation_patch_url && (
              <button
                onClick={() => handleResetToDefault("utilisation_patch_url")}
                className="text-xs text-muted-foreground hover:text-rose-600 transition-colors block mx-auto pt-1"
              >
                Rétablir l'image initiale
              </button>
            )}
          </div>
        </div>

        {/* 8. Pharmacie Pro */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cladode mb-2">
            Espace Pro
          </span>
          <p className="text-xs text-muted-foreground mb-4">Image pharmacienne</p>

          <div className="w-32 h-32 rounded-2xl bg-linen border border-border/80 p-3 flex items-center justify-center mb-6 shadow-inner">
            <img
              src={settings.pharmacie_pro_url || pharmaciePro}
              alt="Pharmacie actuelle"
              className="max-w-full max-h-full object-cover rounded-xl"
            />
          </div>

          <div className="w-full space-y-2">
            <label className="btn-cta text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full">
              {uploadingField === "pharmacie_pro_url" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Remplacer l'image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingField !== null}
                onChange={(e) => handleUpload(e, "pharmacie_pro_url")}
              />
            </label>
            {settings.pharmacie_pro_url && (
              <button
                onClick={() => handleResetToDefault("pharmacie_pro_url")}
                className="text-xs text-muted-foreground hover:text-rose-600 transition-colors block mx-auto pt-1"
              >
                Rétablir l'image initiale
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================= */
/* 4. Settings Tab Component                                         */
/* ================================================================= */
function SettingsTab({
  settings,
  onRefreshSettings,
}: {
  settings: Settings;
  onRefreshSettings: () => Promise<void>;
}) {
  const [phone, setPhone] = useState(settings.phone || "");
  const [email, setEmail] = useState(settings.email || "");
  const [facebook, setFacebook] = useState(settings.facebook_url || "");
  const [instagram, setInstagram] = useState(settings.instagram_url || "");
  const [showInquiryForm, setShowInquiryForm] = useState(settings.show_inquiry_form);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPhone(settings.phone || "");
    setEmail(settings.email || "");
    setFacebook(settings.facebook_url || "");
    setInstagram(settings.instagram_url || "");
    setShowInquiryForm(settings.show_inquiry_form);
  }, [settings]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from("settings")
        .update({
          phone: phone.trim(),
          email: email.trim(),
          facebook_url: facebook.trim(),
          instagram_url: instagram.trim(),
          show_inquiry_form: showInquiryForm,
        })
        .eq("id", 1);

      if (error) throw error;
      await onRefreshSettings();
      toast.success("Paramètres enregistrés avec succès ✓");
    } catch (err) {
      console.error("Erreur de sauvegarde:", err);
      toast.error("Impossible d'enregistrer les paramètres.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="font-fraunces text-3xl font-bold text-nopal">Paramètres Généraux</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configurez les coordonnées de contact et la visibilité du formulaire sur le site.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-border shadow-sm space-y-6">
        {/* Toggle Formulaire de demande B2B */}
        <div className="p-4 rounded-2xl bg-linen/60 border border-border flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-nopal">
              Afficher le formulaire de demande sur le site
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Si désactivé, la section affichera directement les coordonnées de contact.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowInquiryForm(!showInquiryForm)}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-1 shrink-0 ${
              showInquiryForm ? "bg-cladode" : "bg-muted"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                showInquiryForm ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Contact fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="settingsPhone" className="block text-xs font-semibold text-nopal mb-1.5">
              Numéro de téléphone officiel
            </label>
            <input
              id="settingsPhone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0775691557"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-linen/30 text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="settingsEmail" className="block text-xs font-semibold text-nopal mb-1.5">
              Adresse email officielle
            </label>
            <input
              id="settingsEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact.patchnature@gmail.com"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-linen/30 text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="settingsFacebook" className="block text-xs font-semibold text-nopal mb-1.5">
              Lien page Facebook
            </label>
            <input
              id="settingsFacebook"
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/PatchNature"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-linen/30 text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="settingsInstagram" className="block text-xs font-semibold text-nopal mb-1.5">
              Lien profil Instagram
            </label>
            <input
              id="settingsInstagram"
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/patch_nature"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-linen/30 text-sm focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-cta w-full py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enregistrement en cours...</span>
            </>
          ) : (
            <span>Enregistrer les modifications</span>
          )}
        </button>
      </form>
    </div>
  );
}
