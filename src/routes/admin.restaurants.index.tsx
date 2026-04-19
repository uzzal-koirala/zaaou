import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Store, Edit, Trash2, Star, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  cuisine: string | null;
  cover_image_url: string | null;
  address: string | null;
  rating: number | null;
  is_active: boolean;
  is_featured: boolean;
  price_range: string | null;
};

export const Route = createFileRoute("/admin/restaurants/")({
  head: () => ({
    meta: [{ title: "Restaurants - Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <RestaurantsAdminPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

function RestaurantsAdminPage() {
  const [items, setItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("restaurants")
      .select("id, name, slug, cuisine, cover_image_url, address, rating, is_active, is_featured, price_range")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase.from("restaurants").update({ is_active: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(!current ? "Restaurant activated" : "Restaurant hidden");
    load();
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("restaurants").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Restaurant deleted");
    load();
  }

  const filtered = items.filter((r) =>
    [r.name, r.cuisine, r.address].some((v) => (v ?? "").toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Restaurants</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} total · {items.filter((r) => r.is_active).length} active
          </p>
        </div>
        <Link
          to="/admin/restaurants/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add restaurant
        </Link>
      </div>

      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, cuisine, address..."
          className="w-full h-11 rounded-xl border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Store className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg">No restaurants yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Add your first partner restaurant to get started.</p>
          <Link
            to="/admin/restaurants/new"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> Add restaurant
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-soft flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="h-20 w-full sm:w-28 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                {r.cover_image_url ? (
                  <img
                    src={r.cover_image_url}
                    alt={r.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <Store className="h-6 w-6 text-primary/50" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-lg">{r.name}</h3>
                  {r.is_featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      <Star className="h-3 w-3 fill-current" /> Featured
                    </span>
                  )}
                  {!r.is_active && (
                    <span className="rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                  {r.cuisine && <span>{r.cuisine}</span>}
                  {r.price_range && <span className="font-bold">{r.price_range}</span>}
                  {r.rating != null && r.rating > 0 && (
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {Number(r.rating).toFixed(1)}
                    </span>
                  )}
                  {r.address && (
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3" /> {r.address}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(r.id, r.is_active)}
                  className={`text-xs font-semibold rounded-lg px-3 py-1.5 border transition-colors ${
                    r.is_active
                      ? "border-border text-foreground/70 hover:bg-muted"
                      : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                  }`}
                >
                  {r.is_active ? "Hide" : "Show"}
                </button>
                <Link
                  to="/admin/restaurants/$id/edit"
                  params={{ id: r.id }}
                  aria-label="Edit"
                  className="h-9 w-9 grid place-items-center rounded-lg border border-border text-foreground/70 hover:bg-muted hover:text-primary"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => remove(r.id, r.name)}
                  aria-label="Delete"
                  className="h-9 w-9 grid place-items-center rounded-lg border border-border text-foreground/70 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
