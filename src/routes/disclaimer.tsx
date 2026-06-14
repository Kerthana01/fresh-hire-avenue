import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — Career Alerts" },
      { name: "description", content: "Disclaimer for Career Alerts job listings." },
      { property: "og:title", content: "Disclaimer — Career Alerts" },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: () => (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Disclaimer</h1>
      <div className="prose prose-lg mt-6 max-w-none text-foreground/90">
        <p>Career Alerts aggregates publicly available job openings. We are not a recruitment agency and never charge candidates a fee.</p>
        <p>Always verify job details on the official company website before applying.</p>
      </div>
    </div>
  ),
});