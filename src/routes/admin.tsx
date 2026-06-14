import { createFileRoute, Outlet, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Briefcase, FolderTree, Mail, LayoutDashboard, Home } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Career Alerts" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: () => {
    // Client-side gate (ssr:false) — auth handled in component via useAuth
    return {};
  },
  component: AdminLayout,
});

const NAV: ReadonlyArray<{
  to: "/admin" | "/admin/jobs" | "/admin/categories" | "/admin/subscribers";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/subscribers", label: "Subscribers", icon: Mail },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }

  return (
    <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-1">
        <h2 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Admin
        </h2>
        {NAV.map((n) => {
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-muted text-foreground font-medium" }}
              activeOptions={{ exact: n.exact }}
            >
              <Icon className="h-4 w-4" /> {n.label}
            </Link>
          );
        })}
        <div className="pt-4">
          <Link to="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4" /> View site
          </Link>
        </div>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// Re-export to satisfy unused import lint when redirect is needed elsewhere
export const _r = redirect;