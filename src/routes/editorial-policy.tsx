import { createFileRoute, Link } from "@tanstack/react-router";
import { ScamWarning } from "@/components/ScamWarning";
import { CONTACT_EMAIL } from "@/lib/seo-schema";

export const Route = createFileRoute("/editorial-policy")({
  head: () => ({
    meta: [
      { title: "Editorial & Corrections Policy — Career Alerts" },
      { name: "description", content: "How Career Alerts sources and verifies job listings, and how to report an inaccurate, expired, or fraudulent posting." },
      { property: "og:title", content: "Editorial & Corrections Policy — Career Alerts" },
      { property: "og:description", content: "How job listings are sourced and verified on Career Alerts, and how corrections and takedown requests are handled." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://careeralerts.co.in/editorial-policy" },
      { property: "og:image", content: "https://careeralerts.co.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Editorial & Corrections Policy — Career Alerts" },
      { name: "twitter:description", content: "How job listings are sourced and verified on Career Alerts, and how corrections are handled." },
      { name: "twitter:image", content: "https://careeralerts.co.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://careeralerts.co.in/editorial-policy" }],
  }),
  component: EditorialPolicyPage,
});

function EditorialPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Editorial &amp; Corrections Policy</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Career Alerts is run by one person, Kerthana. This page explains exactly where listings come
        from, what is checked before publishing, and how to get something fixed.
      </p>

      <div className="prose prose-lg mt-10 max-w-none text-foreground/90">
        <h2>How jobs are sourced</h2>
        <ul>
          <li>Company careers pages and official recruitment portals.</li>
          <li>Official hiring posts published by companies or their recruiters.</li>
          <li>Openings shared directly with us by recruiters or readers.</li>
        </ul>
        <p>
          Career Alerts does not sell jobs, does not accept payment from candidates, and is not
          involved in any employer&apos;s selection process.
        </p>

        <h2>What is verified before publishing</h2>
        <ol>
          <li>The apply link opens and points to an official company or recruitment-platform page.</li>
          <li>The company and role exist on that official source.</li>
          <li>
            Role details are taken from the official posting. Unstated details are left blank or
            shown as &quot;Not disclosed&quot; instead of being estimated.
          </li>
          <li>Postings that ask candidates for any kind of fee are rejected.</li>
        </ol>
        <p>
          Career Alerts cannot independently audit an employer, guarantee that a role is still open
          at the moment you apply, or guarantee any outcome of your application. Treat every listing
          as a pointer to the official posting, and confirm details there.
        </p>

        <h2>Corrections policy</h2>
        <p>
          If a listing is wrong, expired, duplicated, or should not be here, tell us and it will be
          corrected or removed. Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with:
        </p>
        <ul>
          <li>the link to the job page on Career Alerts,</li>
          <li>what is inaccurate, and</li>
          <li>the official source or link showing the correct information, if you have it.</li>
        </ul>
        <p>
          Employers and recruiters can use the same address to request an update or the removal of
          their posting. Corrections are handled personally, so please allow a little time for a
          reply.
        </p>

        <h2>Reporting a suspicious listing</h2>
        <p>
          Anything that asks candidates for money or personal financial details is treated as a
          priority report and taken down while it is checked. Report it to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or via the{" "}
          <Link to="/contact">contact page</Link>.
        </p>
      </div>

      <ScamWarning className="mt-10" />
    </div>
  );
}
