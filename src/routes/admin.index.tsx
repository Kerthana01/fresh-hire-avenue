import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, FolderTree, Mail, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [jobs, cats, subs] = await Promise.all([
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("subscribers").select("id", { count: "exact", head: true }),
      ]);
      return {
        jobs: jobs.count ?? 0,
        categories: cats.count ?? 0,
        subscribers: subs.count ?? 0,
      };
    },
  });

  const tiles = [
    { to: "/admin/jobs", label: "Jobs", icon: Briefcase, value: stats.data?.jobs },
    { to: "/admin/categories", label: "Categories", icon: FolderTree, value: stats.data?.categories },
    { to: "/admin/subscribers", label: "Subscribers", icon: Mail, value: stats.data?.subscribers },
  ] as const;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage jobs, categories and subscribers.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="group rounded-2xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold">{t.value ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{t.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}