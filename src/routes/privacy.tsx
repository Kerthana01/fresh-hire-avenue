import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Career Alerts" },
      { name: "description", content: "How Career Alerts handles your data and protects your privacy." },
      { property: "og:title", content: "Privacy Policy — Career Alerts" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <div className="prose prose-lg mt-6 max-w-none text-foreground/90">
        <p>We collect only the information you provide when you subscribe to our newsletter.</p>
        <p>We never sell or share your data with third parties. You may unsubscribe at any time.</p>
        <p>For questions, contact us via the contact page.</p>
      </div>
    </div>
  ),
});