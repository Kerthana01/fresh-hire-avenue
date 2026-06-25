import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Home,
  Building2,
  Cpu,
  Code2,
  LineChart,
  Landmark,
  Sparkles,
  Search,
  Mail,
  CheckCircle2,
  ShieldCheck,
  CalendarClock,
  Star,
  MessageCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { JobCard, type JobCardData } from "@/components/JobCard";
import { slugify } from "@/lib/slug";
import { CompanyLogo } from "@/components/CompanyLogo";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Career Alerts – Freshers Jobs, Internships & Off-Campus Drives" },
      { name: "description", content: "Find verified freshers jobs, internships, off-campus drives and hiring opportunities from top companies across India." },
      { property: "og:title", content: "Career Alerts – Freshers Jobs, Internships & Off-Campus Drives" },
      { property: "og:description", content: "Find verified freshers jobs, internships, off-campus drives and hiring opportunities from top companies across India." },
      { property: "og:url", content: "https://careeralerts.co.in/" },
      { property: "og:image", content: "https://careeralerts.co.in/og-image.jpg" },
      { name: "twitter:title", content: "Career Alerts – Freshers Jobs, Internships & Off-Campus Drives" },
      { name: "twitter:description", content: "Find verified freshers jobs, internships, off-campus drives and hiring opportunities from top companies across India." },
      { name: "twitter:image", content: "https://careeralerts.co.in/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://careeralerts.co.in/" },
    ],
  }),
  component: Index,
});

const CATEGORY_ICONS: Record<string, typeof Briefcase> = {
  freshers: GraduationCap,
  internship: Sparkles,
  "off-campus": Briefcase,
  "work-from-home": Home,
  it: Cpu,
  "software-development": Code2,
  "data-science": LineChart,
  product: Building2,
  service: Building2,
  government: Landmark,
};

function Index() {
  const latestJobs = useQuery({
    queryKey: ["jobs", "latest"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("slug,company_name,company_logo,job_title,location,experience,salary,created_at,is_featured")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []) as JobCardData[];
    },
  });

  const trendingJobs = useQuery({
    queryKey: ["jobs", "trending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("slug,company_name,job_title")
        .eq("is_published", true)
        .eq("is_trending", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const companies = useQuery({
    queryKey: ["companies", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("company_name,company_logo")
        .eq("is_published", true);
      if (error) throw error;
      const map = new Map<string, { name: string; logo: string | null; count: number }>();
      for (const row of data ?? []) {
        const key = slugify(row.company_name);
        const existing = map.get(key);
        if (existing) {
          existing.count += 1;
          if (!existing.logo && row.company_logo) existing.logo = row.company_logo;
        } else {
          map.set(key, { name: row.company_name, logo: row.company_logo, count: 1 });
        }
      }
      return Array.from(map.entries())
        .map(([slug, v]) => ({ slug, ...v }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);
    },
  });

  return (
    <div>
      <HeroSection trending={trendingJobs.data ?? []} />
      <LatestJobsSection jobs={latestJobs.data ?? []} loading={latestJobs.isLoading} />
      <CategoriesSection categories={categories.data ?? []} />
      <FeaturedCompaniesSection companies={companies.data ?? []} />
      <NewsletterSection />
      <WhatsAppChannelSection />
    </div>
  );
}

function HeroSection({ trending }: { trending: Array<{ slug: string; company_name: string; job_title: string }> }) {
  const [q, setQ] = useState("");
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-[0.08]" aria-hidden />
      <div
        className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div className="container relative mx-auto px-4 py-20 md:py-28">
        <Badge variant="secondary" className="mb-5 border border-border/70 bg-background/60 backdrop-blur">
          <Sparkles className="mr-1 h-3 w-3 text-accent" /> Updated daily • Verified roles
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Find Freshers Jobs, Internships &amp; Off-Campus Drives at{" "}
          <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
            India&apos;s Top Companies
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
          Curated job updates for freshers, interns, off-campus drives and experienced
          professionals — across product and service companies.
        </p>

        <form
          className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-border/70 bg-card p-2 shadow-[var(--shadow-soft)] sm:flex-row"
          action="/jobs"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search role, company, or location…"
              className="h-12 border-0 bg-transparent pl-11 text-base shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-6">
            Search jobs <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </form>

        {trending.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Trending:</span>
            {trending.slice(0, 5).map((j) => (
              <Link
                key={j.slug}
                to="/jobs/$slug"
                params={{ slug: j.slug }}
                className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-foreground hover:border-primary/50 hover:text-primary"
              >
                {j.job_title} · {j.company_name}
              </Link>
            ))}
          </div>
        )}

        <ul className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { Icon: ShieldCheck, label: "Verified Jobs", sub: "Hand-checked listings" },
            { Icon: CalendarClock, label: "Daily Updates", sub: "Fresh roles every day" },
            { Icon: Star, label: "Top Companies", sub: "Product & service leaders" },
          ].map(({ Icon, label, sub }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3 backdrop-blur"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="truncate text-xs text-muted-foreground">{sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LatestJobsSection({ jobs, loading }: { jobs: JobCardData[]; loading: boolean }) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Latest Job Updates</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fresh openings posted in the last few days.</p>
        </div>
        <Button asChild variant="ghost">
          <Link to="/jobs">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          subtitle="Once an admin adds jobs, they'll appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((j) => <JobCard key={j.slug} job={j} />)}
        </div>
      )}
    </section>
  );
}

function CategoriesSection({ categories }: { categories: Array<{ slug: string; name: string; description: string | null }> }) {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse by category</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pick a track that matches where you are in your career.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = CATEGORY_ICONS[c.slug] ?? Briefcase;
            return (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground group-hover:text-primary">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedCompaniesSection({
  companies,
}: {
  companies: Array<{ slug: string; name: string; logo: string | null; count: number }>;
}) {
  if (companies.length === 0) return null;
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Hiring at leading companies</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore open roles at the companies hiring right now.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {companies.map((c) => (
          <Link
            key={c.slug}
            to="/company/$slug"
            params={{ slug: c.slug }}
            className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
          >
            <CompanyLogo name={c.name} logo={c.logo} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {c.count} active {c.count === 1 ? "opening" : "openings"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("subscribers").insert({ email: email.trim().toLowerCase() });
    setBusy(false);
    if (error) {
      if (error.code === "23505") {
        toast.success("You're already subscribed!");
        setDone(true);
      } else {
        toast.error(error.message || "Could not subscribe");
      }
      return;
    }
    setDone(true);
    toast.success("Subscribed! You'll get daily job alerts.");
  };

  return (
    <section className="container mx-auto px-4 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-8 shadow-[var(--shadow-soft)] md:p-12">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[image:var(--gradient-accent)] opacity-20 blur-3xl" aria-hidden />
        <div className="relative grid items-center gap-6 md:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
              <Mail className="h-3.5 w-3.5" /> Daily Job Alerts
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Never miss a great opportunity
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Get the day&apos;s top job openings delivered straight to your inbox.
            </p>
          </div>
          {done ? (
            <div className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent-soft/40 p-5">
              <CheckCircle2 className="h-6 w-6 text-accent" />
              <p className="text-sm font-medium">You&apos;re subscribed — see you in your inbox.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12"
                aria-label="Email address"
              />
              <Button type="submit" size="lg" className="h-12" disabled={busy}>
                {busy ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function WhatsAppChannelSection() {
  return (
    <section className="container mx-auto px-4 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-[#25D366]/30 bg-card p-8 shadow-[var(--shadow-soft)] md:p-12">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#25D366]/10 blur-3xl" aria-hidden />
        <div className="relative grid items-center gap-6 md:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#25D366]/10 px-3 py-1 text-xs font-medium text-[#128C7E]">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Channel
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Join our WhatsApp Channel for instant job alerts, internships, off-campus drives, and daily hiring updates.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Get verified job opportunities delivered directly to your WhatsApp. Stay updated with fresh openings from top companies every day.
            </p>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <Button asChild size="lg" className="h-12 bg-[#25D366] text-white hover:bg-[#128C7E]">
              <a href="https://whatsapp.com/channel/0029VbCFVJ7BA1euBgf2UV34" target="_blank" rel="noopener noreferrer">
                Join WhatsApp Channel
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
