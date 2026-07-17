import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  IndianRupee,
  MapPin,
  MessageCircle,
  Share2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard, type JobCardData } from "@/components/JobCard";
import { CompanyLogo } from "@/components/CompanyLogo";
import { toast } from "sonner";
import { jobPostingSchema, breadcrumbSchema, faqPageSchema, SITE_URL, safeJsonLd } from "@/lib/seo-schema";
import { normalizeSections } from "@/components/SectionsBuilder";
import DOMPurify from "dompurify";

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
    const ogTitle = job
      ? `${job.job_title} at ${job.company_name}${job.location ? ` – ${job.location}` : ""} | Career Alerts`
      : title;
    const ogImage = job?.company_logo && /^https?:\/\//i.test(job.company_logo)
      ? job.company_logo
      : "https://careeralerts.co.in/og-image.jpg";
    const faqItems = job
      ? [
          {
            q: `What is the role offered by ${job.company_name}?`,
            a: `${job.company_name} is hiring for the role of ${job.job_title}${job.location ? ` in ${job.location}` : ""}.`,
          },
          {
            q: "Who can apply for this job?",
            a:
              job.eligibility ||
              `Candidates meeting the qualification${job.qualification ? ` (${job.qualification})` : ""}${job.experience ? ` and experience requirement (${job.experience})` : ""} are eligible to apply.`,
          },
          {
            q: "What is the last date to apply?",
            a: job.last_date
              ? `The last date to apply is ${format(new Date(job.last_date), "PPP")}.`
              : "Apply as soon as possible — the role may close once positions are filled.",
          },
          {
            q: "How do I apply for this job?",
            a: `Click the "Apply for this Job" button on this page to be redirected to the official application link of ${job.company_name}.`,
          },
        ]
      : [];
    return {
      meta: [
        { title: job?.meta_title ?? title },
        { name: "description", content: desc },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://careeralerts.co.in/jobs/${params.slug}` },
        { property: "og:image", content: ogImage },
        { name: "twitter:title", content: ogTitle },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: `https://careeralerts.co.in/jobs/${params.slug}` }],
      scripts: job
        ? [
            {
              type: "application/ld+json",
              children: safeJsonLd(jobPostingSchema(job)),
            },
            {
              type: "application/ld+json",
              children: safeJsonLd(
                breadcrumbSchema([
                  { name: "Home", url: `${SITE_URL}/` },
                  { name: "Jobs", url: `${SITE_URL}/jobs` },
                  { name: job.job_title, url: `${SITE_URL}/jobs/${params.slug}` },
                ]),
              ),
            },
            {
              type: "application/ld+json",
              children: safeJsonLd(faqPageSchema(faqItems)),
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
      const base = () => supabase
        .from("jobs")
        .select("slug,company_name,company_logo,job_title,location,experience,salary,created_at,is_featured")
        .eq("is_published", true)
        .neq("id", job!.id);

      const results: JobCardData[] = [];
      const seen = new Set<string>();
      const push = (rows: JobCardData[] | null | undefined) => {
        for (const r of rows ?? []) {
          if (seen.has(r.slug)) continue;
          seen.add(r.slug);
          results.push(r);
          if (results.length >= 6) break;
        }
      };

      if (job?.category_id) {
        const { data } = await base().eq("category_id", job.category_id).limit(6);
        push(data as JobCardData[] | null);
      }
      if (results.length < 6) {
        const { data } = await base().eq("company_name", job!.company_name).limit(6);
        push(data as JobCardData[] | null);
      }
      if (results.length < 6) {
        const { data } = await base()
          .order("created_at", { ascending: false })
          .limit(6);
        push(data as JobCardData[] | null);
      }
      return results.slice(0, 6);
    },
  });

  if (!job) return null;

  const customSections = normalizeSections(job.custom_sections).filter(
    (s) => s.title.trim() && stripHtml(s.content).trim(),
  );

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const share = (target: "whatsapp" | "linkedin" | "telegram") => {
    const text = encodeURIComponent(`${job.job_title} at ${job.company_name}`);
    const url = encodeURIComponent(shareUrl);
    const map = {
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
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
              <CompanyLogo name={job.company_name} logo={job.company_logo} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">{job.company_name}</p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{job.job_title}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.location && <Badge variant="secondary"><MapPin className="mr-1 h-3 w-3" />{job.location}</Badge>}
                  {job.salary && <Badge variant="secondary"><IndianRupee className="mr-1 h-3 w-3" />{job.salary}</Badge>}
                  <Badge variant="secondary"><Calendar className="mr-1 h-3 w-3" />Posted {format(new Date(job.created_at), "PP")}</Badge>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied");
                }}
              >
                <Copy className="mr-1.5 h-4 w-4" /> Copy link
              </Button>
            </div>
          </header>

          <TableOfContents
            items={[
              { id: "overview", label: "Job Overview" },
              { id: "about-company", label: "About Company" },
              { id: "job-description", label: "Job Description" },
              ...(job.responsibilities ? [{ id: "responsibilities", label: "Key Responsibilities" }] : []),
              ...(job.skills ? [{ id: "skills", label: "Required Skills" }] : []),
              ...(job.eligibility ? [{ id: "eligibility", label: "Eligibility Criteria" }] : []),
              ...(job.salary ? [{ id: "salary", label: "Salary Details" }] : []),
              ...(job.selection_process ? [{ id: "selection", label: "Selection Process" }] : []),
              ...customSections.map((s, i) => ({ id: `custom-${i}`, label: s.title })),
              { id: "faq", label: "FAQ" },
              { id: "apply", label: "Apply" },
            ]}
          />

          <Section id="overview" title="Job Overview">
            <p>
              <strong>{job.company_name}</strong> is hiring for the role of{" "}
              <strong>{job.job_title}</strong>
              {job.location ? <> based in <strong>{job.location}</strong></> : null}
              {job.experience ? <> for candidates with <strong>{job.experience}</strong> of experience</> : null}
              . Read the full details below and apply through the official link before
              {job.last_date ? <> <strong>{format(new Date(job.last_date), "PPP")}</strong></> : " the last date"}.
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm">
              <li><strong>Company:</strong> {job.company_name}</li>
              <li><strong>Role:</strong> {job.job_title}</li>
              {job.qualification && <li><strong>Qualification:</strong> {job.qualification}</li>}
              {job.experience && <li><strong>Experience:</strong> {job.experience}</li>}
              {job.salary && <li><strong>Salary:</strong> {job.salary}</li>}
              {job.location && <li><strong>Location:</strong> {job.location}</li>}
              {job.last_date && <li><strong>Last date to apply:</strong> {format(new Date(job.last_date), "PPP")}</li>}
            </ul>
          </Section>

          <div className="mt-4 flex justify-center">
            <Button asChild size="sm">
              <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>

          <AdSlot slot="after-overview" />

          <Section id="about-company" title={`About ${job.company_name}`}>
            <p>
              {job.company_name} is actively hiring for the position of{" "}
              {job.job_title}. Joining a growing team like {job.company_name} can be a
              great step in your career, especially for {job.experience || "freshers and experienced"}{" "}
              professionals looking for new opportunities
              {job.location ? <> in {job.location}</> : null}.
            </p>
          </Section>

          <Section id="job-description" title="Job Description" body={job.job_description} />

          <AdSlot slot="after-description" />

          {job.responsibilities && <Section id="responsibilities" title="Key Responsibilities" body={job.responsibilities} />}
          {job.skills && <Section id="skills" title="Required Skills" body={job.skills} />}
          {job.eligibility && <Section id="eligibility" title="Eligibility Criteria" body={job.eligibility} />}

          <AdSlot slot="before-first-apply" />

          <ApplyCta job={job} variant="primary" heading="Apply for this Job" />

          {job.salary && (
            <Section id="salary" title="Salary Details">
              <p>
                The expected salary for the {job.job_title} role at {job.company_name} is{" "}
                <strong>{job.salary}</strong>. Final compensation may vary based on
                skills, interview performance and overall experience.
              </p>
            </Section>
          )}
          {job.selection_process && <Section id="selection" title="Selection Process" body={job.selection_process} />}

          {customSections.map((s, i) => (
            <Section key={`custom-${i}`} id={`custom-${i}`} title={s.title}>
              <div
                className="prose prose-sm max-w-none text-base leading-relaxed text-foreground/90 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.content) }}
              />
            </Section>
          ))}

          <Section id="faq" title="Frequently Asked Questions">
            <FAQ
              items={[
                {
                  q: `What is the role offered by ${job.company_name}?`,
                  a: `${job.company_name} is hiring for the role of ${job.job_title}${job.location ? ` in ${job.location}` : ""}.`,
                },
                {
                  q: "Who can apply for this job?",
                  a:
                    job.eligibility ||
                    `Candidates meeting the qualification${job.qualification ? ` (${job.qualification})` : ""}${job.experience ? ` and experience requirement (${job.experience})` : ""} are eligible to apply.`,
                },
                {
                  q: "What is the last date to apply?",
                  a: job.last_date
                    ? `The last date to apply is ${format(new Date(job.last_date), "PPP")}.`
                    : "Apply as soon as possible — the role may close once positions are filled.",
                },
                {
                  q: "How do I apply for this job?",
                  a: `Click the "Apply for this Job" button on this page to be redirected to the official application link of ${job.company_name}.`,
                },
              ]}
            />
          </Section>

          <AdSlot slot="before-related" />

          <ApplyCta job={job} variant="primary" heading="Apply for this Job" id="apply" />

          {related.data && related.data.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-4 text-2xl font-bold tracking-tight">Related Jobs</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.data.map((j) => <JobCard key={j.slug} job={j} />)}
              </div>
            </section>
          )}

          <section className="mt-8 scroll-mt-24 rounded-2xl border border-[#25D366]/30 bg-card p-6 sm:p-8">
            <h2 className="mb-3 text-2xl font-bold tracking-tight">
              Get Daily Job Alerts on WhatsApp
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Join our WhatsApp Channel to receive daily job updates, internships, freshers hiring alerts, and off-campus opportunities.
            </p>
            <Button asChild size="lg" className="mt-5 bg-[#25D366] text-white hover:bg-[#128C7E]">
              <a href="https://whatsapp.com/channel/0029VbCFVJ7BA1euBgf2UV34" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> Join WhatsApp Channel
              </a>
            </Button>
          </section>
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
    </div>
  );
}

function Section({
  id,
  title,
  body,
  children,
}: {
  id?: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-8 scroll-mt-24 rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      <div className="prose prose-sm max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
        {body ?? children}
      </div>
    </section>
  );
}

function AdSlot({ slot }: { slot: string }) {
  return (
    <div
      data-ad-slot={slot}
      className="mt-8 min-h-[100px] rounded-2xl bg-muted/20"
      aria-hidden="true"
    >
    </div>
  );
}

function ApplyCta({
  job,
  heading,
  id,
}: {
  job: { apply_link: string; company_name: string; last_date: string | null };
  variant?: "primary";
  heading: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="mt-8 scroll-mt-24 rounded-2xl border border-primary/30 bg-[image:var(--gradient-hero)] p-8 text-center text-primary-foreground"
    >
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm opacity-90">
        Don't miss this opportunity at {job.company_name}. Click below to apply
        through the official application link.
      </p>
      <Button asChild size="lg" variant="secondary" className="mt-5">
        <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
          Apply for this Job <ExternalLink className="ml-1.5 h-4 w-4" />
        </a>
      </Button>
      {job.last_date && (
        <p className="mt-3 text-xs opacity-80">
          Last date: {format(new Date(job.last_date), "PPP")}
        </p>
      )}
    </section>
  );
}

function TableOfContents({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav
      aria-label="Table of contents"
      className="mt-6 rounded-2xl border border-border/70 bg-card/60 p-5"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ol className="grid gap-2 text-sm sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="flex items-baseline gap-2 text-foreground/80 hover:text-primary"
            >
              <span className="text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border/70">
      {items.map((item) => (
        <details key={item.q} className="group py-3">
          <summary className="cursor-pointer list-none font-medium text-foreground marker:hidden">
            <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
            {item.q}
          </summary>
          <p className="mt-2 pl-5 text-sm text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
}