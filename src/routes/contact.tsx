import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Career Alerts" },
      { name: "description", content: "Get in touch with Career Alerts for partnership, listing requests or support." },
      { property: "og:title", content: "Contact — Career Alerts" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-4 text-muted-foreground">
        Have a question, a partnership idea, or want to feature a role? Reach out.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href="mailto:hello@career-alerts.example" className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 hover:border-primary/40">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground"><Mail className="h-4 w-4" /></span>
          <div>
            <p className="font-semibold">Email</p>
            <p className="text-sm text-muted-foreground">hello@career-alerts.example</p>
          </div>
        </a>
        <a href="#" className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 hover:border-primary/40">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[image:var(--gradient-accent)] text-accent-foreground"><MessageCircle className="h-4 w-4" /></span>
          <div>
            <p className="font-semibold">Telegram channel</p>
            <p className="text-sm text-muted-foreground">Join for instant alerts</p>
          </div>
        </a>
      </div>
    </div>
  );
}