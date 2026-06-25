import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Career Alerts" },
      { name: "description", content: "Career Alerts is a curated job updates portal for freshers, interns and experienced professionals." },
      { property: "og:title", content: "About — Career Alerts" },
      { property: "og:url", content: "https://careeralerts.co.in/about" },
    ],
    links: [{ rel: "canonical", href: "https://careeralerts.co.in/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">About Career Alerts</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Career Alerts curates verified job opportunities every day so candidates never miss
        what matters: real openings at real companies.
      </p>
      <div className="prose prose-lg mt-8 max-w-none text-foreground/90">
        <p>
          We focus on freshers, internships, off-campus drives, and experienced hiring across
          product-based companies and top service firms. Every listing links directly to the
          official application page — no middlemen, no spam.
        </p>
        <p>
          Our editorial team reviews each role before it goes live. If a posting expires or
          changes, we update or remove it. Subscribe to our newsletter to get a daily digest.
        </p>
      </div>
    </div>
  );
}