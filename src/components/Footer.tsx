import { Link } from "@tanstack/react-router";
import { Briefcase, Facebook, Github, Linkedin, Twitter } from "lucide-react";

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
          <div className="mt-4 flex gap-2 text-muted-foreground">
            <a href="#" aria-label="Twitter" className="hover:text-foreground"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-foreground"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="GitHub" className="hover:text-foreground"><Github className="h-4 w-4" /></a>
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
          <p>Built with love for job seekers.</p>
        </div>
      </div>
    </footer>
  );
}