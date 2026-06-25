import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Linkedin, MessageCircle, Twitter, Youtube } from "lucide-react";

const CONTACT_LINKS = [
  {
    label: "LinkedIn",
    description: "Connect professionally for collaborations and updates.",
    href: "https://www.linkedin.com/in/kerthana-s/",
    Icon: Linkedin,
  },
  {
    label: "X (Twitter)",
    description: "Follow quick announcements and career updates.",
    href: "https://x.com/kerthanak528",
    Icon: Twitter,
  },
  {
    label: "Instagram",
    description: "Follow Career Alerts for visual job update highlights.",
    href: "https://www.instagram.com/career.alerts__/",
    Icon: Instagram,
  },
  {
    label: "YouTube",
    description: "Subscribe for career guidance and job alert content.",
    href: "http://www.youtube.com/@CareerAlerts-v4l",
    Icon: Youtube,
  },
  {
    label: "WhatsApp Channel",
    description: "Join for instant freshers, internship, and off-campus alerts.",
    href: "https://whatsapp.com/channel/0029VbCFVJ7BA1euBgf2UV34",
    Icon: MessageCircle,
  },
] as const;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Career Alerts" },
      { name: "description", content: "Get in touch with Career Alerts for partnership, listing requests or support." },
      { property: "og:title", content: "Contact — Career Alerts" },
      { property: "og:url", content: "https://careeralerts.co.in/contact" },
    ],
    links: [{ rel: "canonical", href: "https://careeralerts.co.in/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-4 text-muted-foreground">
        Have a question, partnership opportunity, recruitment requirement, or job update to share?
        Connect with Career Alerts through the official social channels below.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTACT_LINKS.map(({ label, description, href, Icon }, index) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open Career Alerts ${label}`}
            className="group flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${index === 0 ? "bg-[image:var(--gradient-hero)] text-primary-foreground" : "bg-[image:var(--gradient-accent)] text-accent-foreground"}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold text-foreground group-hover:text-primary">{label}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
