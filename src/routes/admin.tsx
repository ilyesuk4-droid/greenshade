import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Phone,
  Search,
  Lock,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Home,
  Download,
  AlertCircle,
  Truck,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Order } from "@/lib/order-service";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const ADMIN_PASSWORD = "greenshade2026";
const AUTH_KEY = "greenshade_admin_auth";
const ORDERS_STORAGE_KEY = "greenshade_orders";

const STATUSES = [
  { id: "pending", label: "En attente", color: "bg-amber-100 text-amber-900 border-amber-300" },
  { id: "confirmed", label: "Confirmé", color: "bg-blue-100 text-blue-900 border-blue-300" },
  { id: "delivered", label: "Livré", color: "bg-emerald-100 text-emerald-900 border-emerald-300" },
  { id: "cancelled", label: "Annulé", color: "bg-rose-100 text-rose-900 border-rose-300" },
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
    if (pw.trim() === ADMIN_PASSWORD) {
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
          <h1 className="font-fraunces text-2xl font-bold text-nopal">GREEN SHADE Admin</h1>
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
            Code d'accès (Mot de passe)
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
          className="w-full btn-cta py-3 rounded-lg text-sm font-semibold cursor-pointer shadow-nature"
        >
          Connexion
        </button>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-nopal">
            ← Retourner à la boutique
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ---------- Main Admin Dashboard ---------- */
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  const loadOrders = () => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      const parsed: Order[] = stored ? JSON.parse(stored) : [];
      setOrders(parsed);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    if (authed) {
      loadOrders();
    }
  }, [authed]);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    toast.success("Déconnexion réussie");
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      toast.success("Statut de la commande mis à jour ✓");
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (e) {
      toast.error("Erreur de sauvegarde");
    }
  };

  const deleteOrder = (orderId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette commande ?")) return;
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      toast.success("Commande supprimée ✓");
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (e) {
      toast.error("Erreur de suppression");
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      toast.error("Aucune commande à exporter.");
      return;
    }

    const headers = ["ID", "Date", "Client", "Telephone", "Wilaya", "Adresse", "Articles", "Total (DA)", "Statut"];
    const rows = orders.map((o) => [
      o.id,
      fmtDate(o.date),
      `"${o.customer.fullName.replace(/"/g, '""')}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.wilaya}"`,
      `"${(o.customer.address || "").replace(/"/g, '""')}"`,
      `"${o.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}"`,
      o.total,
      o.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `commandes_greenshade_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fichier CSV téléchargé avec succès ✓");
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        o.id.toLowerCase().includes(term) ||
        o.customer.fullName.toLowerCase().includes(term) ||
        o.customer.phone.includes(term) ||
        o.customer.wilaya.toLowerCase().includes(term);
      return matchStatus && matchSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  // Metrics
  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status !== "cancelled").reduce((acc, o) => acc + o.total, 0),
    [orders]
  );
  const pendingCount = useMemo(() => orders.filter((o) => o.status === "pending").length, [orders]);
  const deliveredCount = useMemo(() => orders.filter((o) => o.status === "delivered").length, [orders]);

  if (!authed) {
    return <PasswordGate onOk={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-linen/50 text-encre flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-nopal text-linen px-4 sm:px-8 py-4 flex items-center justify-between border-b border-aloe/20 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img
            src={siteConfig.logoPath}
            alt="Logo"
            className="w-9 h-9 object-cover rounded-full bg-white p-0.5"
          />
          <div>
            <h1 className="font-fraunces font-bold text-lg text-white leading-tight">
              {siteConfig.brandName}
            </h1>
            <span className="text-[11px] text-aloe font-medium">Panneau d'Administration</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Voir le site</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Strip & Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-nopal">
              Gestion des Commandes
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Suivi en temps réel des commandes passées par vos clients.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              className="btn-outline-nature text-xs px-3.5 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualiser</span>
            </button>

            <button
              onClick={exportToCSV}
              className="btn-cta text-xs px-3.5 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter en Excel (CSV)</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">Total Commandes</span>
              <ShoppingBag className="w-4 h-4 text-cladode" />
            </div>
            <div className="font-fraunces text-3xl font-bold text-nopal mt-2">{orders.length}</div>
            <span className="text-[11px] text-muted-foreground mt-1 block">Toutes les commandes reçues</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-semibold">En attente de confirmation</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-fraunces text-3xl font-bold text-amber-700 mt-2">{pendingCount}</div>
            <span className="text-[11px] text-muted-foreground mt-1 block">Nécessite un appel client</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-xs font-semibold">Commandes Livrées</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="font-fraunces text-3xl font-bold text-emerald-700 mt-2">{deliveredCount}</div>
            <span className="text-[11px] text-muted-foreground mt-1 block">Livrées avec succès</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between text-nopal">
              <span className="text-xs font-semibold">Chiffre d'Affaires</span>
              <Truck className="w-4 h-4 text-cladode" />
            </div>
            <div className="font-fraunces text-2xl font-bold text-nopal mt-2">
              {siteConfig.currency.format(totalRevenue)}
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">Paiements à la livraison</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, téléphone, wilaya, ID..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-linen/40 focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="adminFilter" className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Filtrer par statut :
            </label>
            <select
              id="adminFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cladode cursor-pointer"
            >
              <option value="all">Toutes ({orders.length})</option>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({orders.filter((o) => o.status === s.id).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/40" />
              <p>Aucune commande trouvée.</p>
              <p className="text-xs text-muted-foreground">
                Lorsque des clients passent des commandes sur la boutique, elles apparaîtront automatiquement ici.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs font-semibold text-muted-foreground bg-linen/50 border-b border-border">
                  <tr>
                    <th className="p-4">Réf & Date</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Wilaya</th>
                    <th className="p-4">Articles</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredOrders.map((order) => {
                    const statusObj = STATUSES.find((s) => s.id === order.status) || STATUSES[0];
                    const cleanPhone = order.customer.phone.replace(/\D/g, "");
                    const waLink = `https://wa.me/213${cleanPhone.startsWith("0") ? cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
                      `Bonjour ${order.customer.fullName}, nous vous contactons concernant votre commande #${order.id} sur GREEN SHADE.`
                    )}`;

                    return (
                      <tr key={order.id} className="hover:bg-linen/30 transition-colors">
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-nopal block text-xs">
                            {order.id}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {fmtDate(order.date)}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-nopal">{order.customer.fullName}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {order.customer.phone}
                          </div>
                        </td>

                        <td className="p-4 text-xs whitespace-nowrap">
                          <span className="font-medium text-nopal">{order.customer.wilaya}</span>
                          {order.customer.address && (
                            <span className="text-[11px] text-muted-foreground block max-w-xs truncate">
                              {order.customer.address}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-xs">
                          <span className="font-medium text-nopal">
                            {order.items.reduce((acc, i) => acc + i.quantity, 0)} article(s)
                          </span>
                          <span className="text-[11px] text-muted-foreground block max-w-xs truncate">
                            {order.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                          </span>
                        </td>

                        <td className="p-4 text-xs font-bold text-nopal whitespace-nowrap">
                          {siteConfig.currency.format(order.total)}
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-cladode ${statusObj.color}`}
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
                            {/* Call Button */}
                            <a
                              href={`tel:${order.customer.phone}`}
                              className="p-1.5 rounded-lg bg-linen text-nopal hover:bg-cladode hover:text-white transition-colors"
                              title="Appeler le client"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* WhatsApp Button */}
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                              title="Écrire sur WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => deleteOrder(order.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                              title="Supprimer la commande"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
      </main>
    </div>
  );
}
