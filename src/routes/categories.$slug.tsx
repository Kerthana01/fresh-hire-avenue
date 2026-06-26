import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobCard, type JobCardData } from "@/components/JobCard";
import { Briefcase } from "lucide-react";
import { collectionPageSchema } from "@/lib/seo-schema";

const categoryQuery = (slug: string) => ({
  queryKey: ["category", slug],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data;
  },
});

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params, context }) => context.queryClient.ensureQueryData(categoryQuery(params.slug)),
  head: ({ loaderData, params }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — Career Alerts` : "Category — Career Alerts" },
      { name: "description", content: loaderData?.description ?? `Latest ${loaderData?.name ?? ""} jobs, internships and off-campus drives from top companies, updated daily on Career Alerts.` },
      { property: "og:title", content: loaderData ? `${loaderData.name} Jobs — Career Alerts` : "Category — Career Alerts" },
      { property: "og:description", content: loaderData?.description ?? `Latest ${loaderData?.name ?? "category"} jobs and openings curated on Career Alerts.` },
      { property: "og:url", content: `https://careeralerts.co.in/categories/${params.slug}` },
      { property: "og:image", content: "https://careeralerts.co.in/og-image.jpg" },
      { name: "twitter:title", content: loaderData ? `${loaderData.name} Jobs — Career Alerts` : "Category — Career Alerts" },
      { name: "twitter:description", content: loaderData?.description ?? `Latest ${loaderData?.name ?? "category"} jobs and openings on Career Alerts.` },
      { name: "twitter:image", content: "https://careeralerts.co.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: `https://careeralerts.co.in/categories/${params.slug}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          collectionPageSchema({
            name: loaderData ? `${loaderData.name} Jobs — Career Alerts` : "Category — Career Alerts",
            description:
              loaderData?.description ??
              `Latest ${loaderData?.name ?? "category"} jobs and openings on Career Alerts.`,
            url: `https://careeralerts.co.in/categories/${params.slug}`,
          }),
        ),
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Category not found</h1>
      <Link to="/jobs" className="mt-4 inline-block text-primary hover:underline">Browse all jobs</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: category } = useQuery(categoryQuery(slug));
  const jobs = useQuery({
    queryKey: ["category-jobs", category?.id],
    enabled: !!category,
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("slug,company_name,company_logo,job_title,location,experience,salary,created_at,is_featured")
        .eq("is_published", true)
        .eq("category_id", category!.id)
        .order("created_at", { ascending: false });
      return (data ?? []) as JobCardData[];
    },
  });

  if (!category) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/jobs" className="hover:text-foreground">Jobs</Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
      {category.description && <p className="mt-2 text-muted-foreground">{category.description}</p>}

      <div className="mt-8">
        {jobs.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
            ))}
          </div>
        ) : (jobs.data?.length ?? 0) === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No jobs in this category yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.data!.map((j) => <JobCard key={j.slug} job={j} />)}
          </div>
        )}
      </div>
    </div>
  );
}