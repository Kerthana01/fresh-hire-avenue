import { Link } from "@tanstack/react-router";
import { Briefcase, Calendar, IndianRupee, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export interface JobCardData {
  slug: string;
  company_name: string;
  company_logo: string | null;
  job_title: string;
  location: string | null;
  experience: string | null;
  salary: string | null;
  created_at: string;
  is_featured?: boolean;
}

export function JobCard({ job }: { job: JobCardData }) {
  const initials = job.company_name.slice(0, 2).toUpperCase();
  return (
    <Link
      to="/jobs/$slug"
      params={{ slug: job.slug }}
      className="group relative block overflow-hidden rounded-2xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
    >
      {job.is_featured && (
        <Badge className="absolute right-4 top-4 bg-[image:var(--gradient-accent)] text-accent-foreground border-0">
          Featured
        </Badge>
      )}
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-muted text-sm font-bold text-muted-foreground">
          {job.company_logo ? (
            <img src={job.company_logo} alt={`${job.company_name} logo`} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-muted-foreground">{job.company_name}</p>
          <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary">
            {job.job_title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {job.location && (
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
            )}
            {job.experience && (
              <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.experience}</span>
            )}
            {job.salary && (
              <span className="inline-flex items-center gap-1"><IndianRupee className="h-3 w-3" />{job.salary}</span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-xs text-muted-foreground">View details</span>
        <Button size="sm" variant="secondary" className="pointer-events-none">Apply Now</Button>
      </div>
    </Link>
  );
}