import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Building2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { JobCard, type JobCardData } from "@/components/JobCard";
import { slugify } from "@/lib/slug";
import { CompanyLogo } from "@/components/CompanyLogo";
import { collectionPageSchema, breadcrumbSchema, SITE_URL, SITE_NAME } __TMP__from "@/lib/seo-schema";

export const Route = createFileRoute("/company/$slug")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const title = `${name} Jobs & Careers | Career Alerts`;
    const description = `Browse the latest verified job openings, internships and off-campus drives at ${name}. Updated daily on Career Alerts.`;
    const image = "https://careeralerts.co.in/og-image.jpg";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `https://careeralerts.co.in/company/${params.slug}` },
        { property: "og:image", content: image },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: `https://careeralerts.co.in/company/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: safeJsonLd(
            collectionPageSchema({
              name: title,
              description,
              url: `${SITE_URL}/company/${params.slug}`,
            }),
          ),
        },
        {
          type: "application/ld+json",
          children: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "Organization",
            name,
            url: `${SITE_URL}/company/${params.slug}`,
            sameAs: `${SITE_URL}/company/${params.slug}`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SITE_URL}/company/${params.slug}`,
            },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          }),
        },
        {
          type: "application/ld+json",
          children: safeJsonLd(
            breadcrumbSchema([
              { name: "Home", url: `${SITE_URL}/` },
              { name: "Jobs", url: `${SITE_URL}/jobs` },
              { name, url: `${SITE_URL}/company/${params.slug}` },
            ]),
          ),
        },
      ],
    };
  },
  component: CompanyPage,
});

type Row = JobCardData & { company_name: string; company_logo: string | null };

function CompanyPage() {
  const { slug } = Route.useParams();
  const [q, setQ] = useState("");

  const jobs = useQuery({
    queryKey: ["company", slug, "jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("slug,company_name,company_logo,job_title,location,experience,salary,created_at,is_featured")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const all = jobs.data ?? [];
  const matches = useMemo(
    () => all.filter((j) => slugify(j.company_name) === slug),
    [all, slug],
  );

  const company = matches[0];
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return matches;
    return matches.filter((j) =>
      [j.job_title, j.location ?? "", j.experience ?? ""].some((f) =>
        f.toLowerCase().includes(term),
      ),
    );
  }, [matches, q]);

  const related = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; logo: string | null; count: number }>();
    for (const j of all) {
      const key = slugify(j.company_name);
      if (key === slug) continue;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.logo && j.company_logo) existing.logo = j.company_logo;
      } else {
        map.set(key, { slug: key, name: j.company_name, logo: j.company_logo, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [all, slug]);

  if (jobs.isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
      </div>
    );
  }

  if (!company) {
    throw notFound();
  }

  const name = company.company_name;

  return (
    <div>
      <section className="border-b border-border/60 bg-muted/30">
        <div className="container mx-auto px-4 py-10">
          <nav className="mb-4 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-1">/</span>
            <Link to="/jobs" className="hover:text-foreground">Jobs</Link>
            <span className="mx-1">/</span>
            <span className="text-foreground">{name}</span>
          </nav>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <CompanyLogo name={name} logo={company.company_logo} size="lg" />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{name} Careers &amp; Jobs</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {matches.length} active {matches.length === 1 ? "opening" : "openings"} curated on Career Alerts.
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-sm text-muted-foreground">
            Explore the latest verified jobs, internships and off-campus drives at {name}. New roles are added
            daily — bookmark this page or subscribe to get notified.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Open roles at {name}</h2>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search jobs at ${name}`}
              className="pl-9"
              aria-label={`Search jobs at ${name}`}
            />
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
            No jobs match your search.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((j) => <JobCard key={j.slug} job={j} />)}
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="border-t border-border/60 bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-xl font-semibold tracking-tight">Related companies</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  to="/company/$slug"
                  params={{ slug: c.slug }}
                  className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <CompanyLogo name={c.name} logo={c.logo} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">{c.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{c.count} {c.count === 1 ? "job" : "jobs"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}