import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Career Alerts" },
      { name: "description", content: "Terms of use for Career Alerts." },
      { property: "og:title", content: "Terms & Conditions — Career Alerts" },
      { property: "og:url", content: "https://careeralerts.co.in/terms" },
    ],
    links: [{ rel: "canonical", href: "https://careeralerts.co.in/terms" }],
  }),
  component: () => (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Terms & Conditions</h1>
      <div className="prose prose-lg mt-6 max-w-none text-foreground/90">
        <p>By using Career Alerts, you agree to use the information for personal, non-commercial purposes.</p>
        <p>All job listings are published in good faith; we are not responsible for hiring decisions made by third-party companies.</p>
      </div>
    </div>
  ),
});