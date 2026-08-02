import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Search, X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/JobCard";
import { collectionPageSchema, safeJsonLd } from "@/lib/seo-schema";
import { categoriesQuery, jobsListQuery, PAGE_SIZE } from "@/lib/job-queries";

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  page: z.number().int().min(1).optional().catch(1),
});

export const Route = createFileRoute("/jobs/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ q: search.q, category: search.category, page: search.page ?? 1 }),
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(jobsListQuery(deps)),
    ]);
  },
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-4 py-20 text-center" role="alert">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">No jobs found</h1>
    </div>
  ),
  head: () => ({
    meta: [
      { title: "Browse all jobs — Career Alerts" },
      { name: "description", content: "Browse the latest job openings across freshers, internships, off-campus drives and experienced hiring." },
      { property: "og:title", content: "Browse all jobs — Career Alerts" },
      { property: "og:description", content: "Browse verified job openings across freshers, internships, off-campus drives and experienced hiring on Career Alerts." },
      { property: "og:url", content: "https://careeralerts.co.in/jobs" },
      { property: "og:image", content: "https://careeralerts.co.in/og-image.jpg" },
      { name: "twitter:title", content: "Browse all jobs — Career Alerts" },
      { name: "twitter:description", content: "Browse verified job openings across freshers, internships, off-campus drives and experienced hiring on Career Alerts." },
      { name: "twitter:image", content: "https://careeralerts.co.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://careeralerts.co.in/jobs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: safeJsonLd(
          collectionPageSchema({
            name: "All Jobs — Career Alerts",
            description:
              "Browse verified job openings across freshers, internships, off-campus drives and experienced hiring on Career Alerts.",
            url: "https://careeralerts.co.in/jobs",
          }),
        ),
      },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [qInput, setQInput] = useState(search.q ?? "");

  const page = search.page ?? 1;

  const categories = useQuery(categoriesQuery);
  const jobs = useSuspenseQuery(jobsListQuery({ q: search.q, category: search.category, page }));

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

      {jobs.data.items.length === 0 ? (
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