import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react";

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
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-4 text-muted-foreground">
        Have a question, partnership opportunity, recruitment requirement, or job update to share? Feel free to get in touch.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a href="mailto:kerthana.careers@gmail.com" className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 hover:border-primary/40">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground"><Mail className="h-4 w-4" /></span>
          <div>
            <p className="font-semibold">Email</p>
            <p className="text-sm text-muted-foreground">kerthana.careers@gmail.com</p>
          </div>
        </a>
        <a href="https://www.linkedin.com/in/kerthana-s/" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 hover:border-primary/40">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground"><Linkedin className="h-4 w-4" /></span>
          <div>
            <p className="font-semibold">LinkedIn</p>
            <p className="text-sm text-muted-foreground">linkedin.com/in/kerthana-s</p>
          </div>
        </a>
        <a href="https://github.com/Kerthana01/Kerthana01" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 hover:border-primary/40">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground"><Github className="h-4 w-4" /></span>
          <div>
            <p className="font-semibold">GitHub</p>
            <p className="text-sm text-muted-foreground">github.com/Kerthana01</p>
          </div>
        </a>
        <a href="https://x.com/kerthanak528" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 hover:border-primary/40">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[image:var(--gradient-accent)] text-accent-foreground"><Twitter className="h-4 w-4" /></span>
          <div>
            <p className="font-semibold">X (Twitter)</p>
            <p className="text-sm text-muted-foreground">x.com/kerthanak528</p>
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
