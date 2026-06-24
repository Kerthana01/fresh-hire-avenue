import { Link } from "@tanstack/react-router";
import { Briefcase, Instagram, Linkedin, MessageCircle, Twitter, Youtube } from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kerthana-s/",
    Icon: Linkedin,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/kerthanak528",
    Icon: Twitter,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/career.alerts__/",
    Icon: Instagram,
  },
  {
    label: "YouTube",
    href: "http://www.youtube.com/@CareerAlerts-v4l",
    Icon: Youtube,
  },
  {
    label: "WhatsApp Channel",
    href: "https://whatsapp.com/channel/0029VbCFVJ7BA1euBgf2UV34",
    Icon: MessageCircle,
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-muted/40">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
              <Briefcase className="h-4 w-4" />
            </span>
            Career Alerts
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Trusted job updates for freshers, interns, and experienced professionals — verified daily.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-muted-foreground">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-background/70 transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Explore</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/jobs" className="hover:text-foreground">All Jobs</Link></li>
            <li><Link to="/categories/freshers" className="hover:text-foreground">Freshers</Link></li>
            <li><Link to="/categories/internship" className="hover:text-foreground">Internships</Link></li>
            <li><Link to="/categories/off-campus" className="hover:text-foreground">Off-Campus</Link></li>
            <li><Link to="/categories/work-from-home" className="hover:text-foreground">Work From Home</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms &amp; Conditions</Link></li>
            <li><Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">For Recruiters</h3>
          <p className="text-sm text-muted-foreground">
            Want to feature your job? Reach out via the contact page and we&apos;ll help your role get seen by thousands.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Career Alerts. All rights reserved.</p>
          <p>Created by Kerthana to help students, freshers, interns, and professionals discover new career opportunities.</p>
        </div>
      </div>
    </footer>
  );
}
