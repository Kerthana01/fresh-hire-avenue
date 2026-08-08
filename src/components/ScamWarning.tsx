import { ShieldAlert } from "lucide-react";

/**
 * Recruitment-scam warning. Reinforces the Disclaimer's "we never charge fees"
 * point on the pages where candidates look for trust signals.
 */
export function ScamWarning({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="scam-warning-heading"
      className={`rounded-2xl border border-destructive/30 bg-destructive/5 p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="scam-warning-heading" className="text-lg font-semibold text-foreground">
            Beware of recruitment scams
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Career Alerts is not a recruitment agency and never charges candidates a fee — not for
            applying, not for registration, not for training, and not for an offer letter.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li>• No genuine employer asks you to pay money to get a job.</li>
            <li>• Apply only through the official company link shown on each job page.</li>
            <li>• Never share bank details, OTPs, or documents with unverified recruiters.</li>
            <li>• Nobody from Career Alerts will contact you asking for payment.</li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Spotted something suspicious in a listing? Report it and we will review it.
          </p>
        </div>
      </div>
    </section>
  );
}
