import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { JobCard } from "@/components/JobCard";
import { Briefcase } from "lucide-react";
import { categoryLabel, cleanTitle, collectionPageSchema, safeJsonLd } from "@/lib/seo-schema";
import { categoryBySlugQuery, categoryJobsQuery } from "@/lib/job-queries";

export const Route = createFileRoute("/categories/$slug")({
  loader: async ({ params, context }) => {
    const category = await context.queryClient.ensureQueryData(categoryBySlugQuery(params.slug));
    if (!category) throw notFound();
    await context.queryClient.ensureQueryData(categoryJobsQuery(category.id));
    return category;
  },
  head: ({ loaderData, params }) => {
    const label = loaderData ? categoryLabel(loaderData.name) : "Category";
    const pageTitle = `${label} — Career Alerts`;
    const desc =
      cleanTitle(loaderData?.description) ||
      `Latest ${label.toLowerCase()}, internships and off-campus drives from top companies, updated daily on Career Alerts.`;
    return {
    meta: [
      { title: pageTitle },
      { name: "description", content: desc },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: desc },
      { property: "og:url", content: `https://careeralerts.co.in/categories/${params.slug}` },
      { property: "og:image", content: "https://careeralerts.co.in/og-image.jpg" },
      { name: "twitter:title", content: pageTitle },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: "https://careeralerts.co.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: `https://careeralerts.co.in/categories/${params.slug}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: safeJsonLd(
          collectionPageSchema({
            name: pageTitle,
            description: desc,
            url: `https://careeralerts.co.in/categories/${params.slug}`,
          }),
        ),
      },
    ],
    };
  },
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
  const { data: category } = useSuspenseQuery(categoryBySlugQuery(slug));
  const jobs = useSuspenseQuery(categoryJobsQuery(category?.id));

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
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{categoryLabel(category.name)}</h1>
      {category.description && <p className="mt-2 text-muted-foreground">{category.description}</p>}

      <div className="mt-8">
        {jobs.data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No jobs in this category yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.data.map((j) => <JobCard key={j.slug} job={j} />)}
          </div>
        )}
      </div>
    </div>
  );
}