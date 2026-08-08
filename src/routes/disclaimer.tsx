import { createFileRoute, Link } from "@tanstack/react-router";
import { ScamWarning } from "@/components/ScamWarning";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — Career Alerts" },
      { name: "description", content: "Disclaimer for Career Alerts job listings." },
      { property: "og:title", content: "Disclaimer — Career Alerts" },
      { property: "og:description", content: "Disclaimer covering Career Alerts job listings and external company applications." },
      { property: "og:url", content: "https://careeralerts.co.in/disclaimer" },
      { property: "og:image", content: "https://careeralerts.co.in/og-image.jpg" },
      { name: "twitter:title", content: "Disclaimer — Career Alerts" },
      { name: "twitter:description", content: "Disclaimer covering Career Alerts job listings and external company applications." },
      { name: "twitter:image", content: "https://careeralerts.co.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://careeralerts.co.in/disclaimer" }],
  }),
  component: () => (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Disclaimer</h1>
      <div className="prose prose-lg mt-6 max-w-none text-foreground/90">
        <p>Career Alerts aggregates publicly available job openings. We are not a recruitment agency and never charge candidates a fee.</p>
        <p>Always verify job details on the official company website before applying.</p>
        <p>
          See our <Link to="/editorial-policy">editorial and corrections policy</Link> for how
          listings are sourced, verified, and corrected.
        </p>
      </div>
      <ScamWarning className="mt-8" />
    </div>
  ),
});