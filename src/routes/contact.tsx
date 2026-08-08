import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Linkedin, Mail, MessageCircle, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScamWarning } from "@/components/ScamWarning";
import { CONTACT_EMAIL } from "@/lib/seo-schema";

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
      { property: "og:description", content: "Reach the Career Alerts team for partnerships, listing requests, or support." },
      { property: "og:url", content: "https://careeralerts.co.in/contact" },
      { property: "og:image", content: "https://careeralerts.co.in/og-image.jpg" },
      { name: "twitter:title", content: "Contact — Career Alerts" },
      { name: "twitter:description", content: "Reach the Career Alerts team for partnerships, listing requests, or support." },
      { name: "twitter:image", content: "https://careeralerts.co.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://careeralerts.co.in/contact" }],
  }),
  component: ContactPage,
});

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const disabled = !name.trim() || !email.trim() || !message.trim();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject.trim() || "Career Alerts enquiry",
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="cf-name">Your name</Label>
          <Input id="cf-name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cf-email">Your email</Label>
          <Input id="cf-email" type="email" value={email} maxLength={255} onChange={(e) => setEmail(e.target.value)} required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cf-subject">Subject</Label>
        <Input
          id="cf-subject"
          value={subject}
          maxLength={150}
          placeholder="Job correction, listing request, partnership…"
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cf-message">Message</Label>
        <Textarea id="cf-message" rows={5} value={message} maxLength={2000} onChange={(e) => setMessage(e.target.value)} required />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={disabled}>Send message</Button>
        <span className="text-xs text-muted-foreground">
          This opens your email app with the message ready to send to {CONTACT_EMAIL}.
        </span>
      </div>
    </form>
  );
}

function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-4 text-muted-foreground">
        Career Alerts is run by one person, Kerthana. Questions, listing requests, partnership
        enquiries, and corrections to a job post all reach the same inbox.
      </p>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-foreground">Email us directly</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-primary hover:underline">
              {CONTACT_EMAIL}
            </a>
            <p className="mt-1 text-sm text-muted-foreground">
              Reporting an inaccurate or expired listing? Include the job page link — see the{" "}
              <Link to="/editorial-policy" className="text-primary hover:underline">corrections policy</Link>.
            </p>
          </div>
        </div>
        <Button asChild className="sm:shrink-0">
          <a href={`mailto:${CONTACT_EMAIL}`}>Write an email</a>
        </Button>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight">Send a message</h2>
      <ContactForm />

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Official channels</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <ScamWarning className="mt-10" />
    </div>
  );
}
