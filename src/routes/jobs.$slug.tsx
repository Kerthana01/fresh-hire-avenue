import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  GraduationCap,
  IndianRupee,
  MapPin,
  Share2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard, type JobCardData } from "@/components/JobCard";
import { toast } from "sonner";

const jobQuery = (slug: string) => ({
  queryKey: ["job", slug],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data;
  },
});

export const Route = createFileRoute("/jobs/$slug")({
  loader: async ({ params, context }) => {
    return context.queryClient.ensureQueryData(jobQuery(params.slug));
  },
  head: ({ loaderData, params }) => {
    const job = loaderData;
    const title = job ? `${job.job_title} at ${job.company_name} — Career Alerts` : "Job — Career Alerts";
    const desc = job
      ? (job.meta_description ?? job.job_description.replace(/\s+/g, " ").slice(0, 160))
      : "";
    return {
      meta: [
        { title: job?.meta_title ?? title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/jobs/${params.slug}` },
        ...(job?.company_logo ? [{ property: "og:image", content: job.company_logo }] : []),
      ],
      links: [{ rel: "canonical", href: `/jobs/${params.slug}` }],
      scripts: job
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "JobPosting",
                title: job.job_title,
                description: job.job_description,
                datePosted: job.created_at,
                validThrough: job.last_date,
                hiringOrganization: {
                  "@type": "Organization",
                  name: job.company_name,
                  logo: job.company_logo,
                },
                jobLocation: job.location
                  ? {
                      "@type": "Place",
                      address: { "@type": "PostalAddress", addressLocality: job.location },
                    }
                  : undefined,
                employmentType: job.experience,
              }),
            },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Job not found</h1>
      <p className="mt-2 text-muted-foreground">This listing may have been removed or expired.</p>
      <Button asChild className="mt-6"><Link to="/jobs">Browse all jobs</Link></Button>
    </div>
  ),
  errorComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <Button asChild className="mt-6"><Link to="/jobs">Back to jobs</Link></Button>
    </div>
  ),
  component: JobDetailPage,
});

function JobDetailPage() {
  const { slug } = Route.useParams();
  const { data: job } = useQuery(jobQuery(slug));

  const related = useQuery({
    queryKey: ["related", job?.category_id, job?.id],
    enabled: !!job,
    queryFn: async () => {
      const q = supabase
        .from("jobs")
        .select("slug,company_name,company_logo,job_title,location,experience,salary,created_at,is_featured")
        .eq("is_published", true)
        .neq("id", job!.id)
        .limit(4);
      const final = job?.category_id ? q.eq("category_id", job.category_id) : q;
      const { data } = await final;
      return (data ?? []) as JobCardData[];
    },
  });

  if (!job) return null;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const share = (target: "whatsapp" | "linkedin" | "telegram") => {
    const text = encodeURIComponent(`${job.job_title} at ${job.company_name}`);
    const url = encodeURIComponent(shareUrl);
    const map = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    };
    window.open(map[target], "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/jobs" className="hover:text-foreground">Jobs</Link>
        <span>/</span>
        <span className="truncate text-foreground">{job.job_title}</span>
      </nav>

      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/jobs"><ArrowLeft className="mr-1 h-4 w-4" /> All jobs</Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <article>
          <header className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-muted text-base font-bold text-muted-foreground">
                {job.company_logo ? (
                  <img src={job.company_logo} alt={`${job.company_name} logo`} className="h-full w-full object-cover" />
                ) : (
                  job.company_name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">{job.company_name}</p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{job.job_title}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.location && <Badge variant="secondary"><MapPin className="mr-1 h-3 w-3" />{job.location}</Badge>}
                  {job.experience && <Badge variant="secondary"><Briefcase className="mr-1 h-3 w-3" />{job.experience}</Badge>}
                  {job.salary && <Badge variant="secondary"><IndianRupee className="mr-1 h-3 w-3" />{job.salary}</Badge>}
                  {job.qualification && <Badge variant="secondary"><GraduationCap className="mr-1 h-3 w-3" />{job.qualification}</Badge>}
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button asChild size="lg" className="flex-1 sm:flex-none">
                <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                  Apply Now <ExternalLink className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied");
                }}
              >
                <Copy className="mr-1.5 h-4 w-4" /> Copy
              </Button>
            </div>
          </header>

          <Section title="Job Description" body={job.job_description} />
          {job.responsibilities && <Section title="Responsibilities" body={job.responsibilities} />}
          {job.eligibility && <Section title="Eligibility Criteria" body={job.eligibility} />}
          {job.skills && <Section title="Skills Required" body={job.skills} />}
          {job.selection_process && <Section title="Selection Process" body={job.selection_process} />}
        </article>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold">Job summary</h3>
            <dl className="space-y-2 text-sm">
              {job.last_date && (
                <Row label="Last date">
                  <Calendar className="mr-1 inline h-3.5 w-3.5" />
                  {format(new Date(job.last_date), "PPP")}
                </Row>
              )}
              <Row label="Posted">{format(new Date(job.created_at), "PPP")}</Row>
              {job.experience && <Row label="Experience">{job.experience}</Row>}
              {job.qualification && <Row label="Qualification">{job.qualification}</Row>}
            </dl>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Share2 className="h-4 w-4" /> Share this job</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => share("whatsapp")}>WhatsApp</Button>
              <Button variant="outline" size="sm" onClick={() => share("linkedin")}>LinkedIn</Button>
              <Button variant="outline" size="sm" onClick={() => share("telegram")}>Telegram</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-accent/30 bg-accent-soft/40 p-5">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <p className="mt-2 text-sm font-medium">Verified listing</p>
            <p className="mt-1 text-xs text-muted-foreground">Apply directly via the official company link.</p>
          </div>
        </aside>
      </div>

      {related.data && related.data.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-bold tracking-tight">Similar jobs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.data.map((j) => <JobCard key={j.slug} job={j} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-6 rounded-2xl border border-border/70 bg-card p-6">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground/90">{body}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{children}</dd>
    </div>
  );
}