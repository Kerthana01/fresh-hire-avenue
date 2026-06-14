import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Search, X, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard, type JobCardData } from "@/components/JobCard";

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  page: z.number().int().min(1).optional().catch(1),
});

export const Route = createFileRoute("/jobs/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Browse all jobs — Career Alerts" },
      { name: "description", content: "Browse the latest job openings across freshers, internships, off-campus drives and experienced hiring." },
      { property: "og:title", content: "Browse all jobs — Career Alerts" },
      { property: "og:url", content: "/jobs" },
    ],
    links: [{ rel: "canonical", href: "/jobs" }],
  }),
  component: JobsPage,
});

const PAGE_SIZE = 12;

function JobsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [qInput, setQInput] = useState(search.q ?? "");

  const page = search.page ?? 1;

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const jobs = useQuery({
    queryKey: ["jobs", "list", search.q ?? "", search.category ?? "", page],
    queryFn: async () => {
      let q = supabase
        .from("jobs")
        .select("slug,company_name,company_logo,job_title,location,experience,salary,created_at,is_featured,category_id", { count: "exact" })
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (search.q) {
        const like = `%${search.q}%`;
        q = q.or(`job_title.ilike.${like},company_name.ilike.${like},location.ilike.${like}`);
      }
      if (search.category && categories.data) {
        const cat = categories.data.find((c) => c.slug === search.category);
        if (cat) q = q.eq("category_id", cat.id);
      }
      const { data, count, error } = await q;
      if (error) throw error;
      return { items: (data ?? []) as JobCardData[], count: count ?? 0 };
    },
    enabled: !search.category || !!categories.data,
  });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((jobs.data?.count ?? 0) / PAGE_SIZE)),
    [jobs.data?.count],
  );

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: { ...search, q: qInput.trim() || undefined, page: 1 } });
  };

  const setCategory = (slug: string | undefined) =>
    navigate({ search: { ...search, category: slug, page: 1 } });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All Jobs</h1>
        <p className="mt-2 text-muted-foreground">
          {jobs.data?.count ?? 0} opportunities currently open.
        </p>
      </div>

      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Search by role, company, or location"
            className="h-11 pl-9"
          />
          {qInput && (
            <button
              type="button"
              onClick={() => {
                setQInput("");
                navigate({ search: { ...search, q: undefined, page: 1 } });
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button type="submit" className="h-11">Search</Button>
      </form>

      <div className="mb-8 flex flex-wrap gap-2">
        <Badge
          variant={!search.category ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setCategory(undefined)}
        >
          All
        </Badge>
        {(categories.data ?? []).map((c) => (
          <Badge
            key={c.slug}
            variant={search.category === c.slug ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setCategory(c.slug)}
          >
            {c.name}
          </Badge>
        ))}
      </div>

      {jobs.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
          ))}
        </div>
      ) : (jobs.data?.items.length ?? 0) === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">No matching jobs</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different keyword or category.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.data!.items.map((j) => <JobCard key={j.slug} job={j} />)}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => navigate({ search: { ...search, page: page - 1 } })}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => navigate({ search: { ...search, page: page + 1 } })}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}