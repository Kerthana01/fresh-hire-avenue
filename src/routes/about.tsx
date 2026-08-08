import { createFileRoute, Link } from "@tanstack/react-router";
import { ScamWarning } from "@/components/ScamWarning";
import { CONTACT_EMAIL } from "@/lib/seo-schema";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Career Alerts — Who Runs It & How Jobs Are Verified" },
      { name: "description", content: "Career Alerts is an independent, one-person job updates portal run by Kerthana. Here's how every freshers, internship and off-campus listing is checked before publishing." },
      { property: "og:title", content: "About Career Alerts — Who Runs It & How Jobs Are Verified" },
      { property: "og:description", content: "An independent job updates portal for freshers, interns and experienced professionals — run by one person, with every listing linked to the official application page." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://careeralerts.co.in/about" },
      { property: "og:image", content: "https://careeralerts.co.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Career Alerts — Who Runs It & How Jobs Are Verified" },
      { name: "twitter:description", content: "An independent job updates portal for freshers, interns and experienced professionals — run by one person." },
      { name: "twitter:image", content: "https://careeralerts.co.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://careeralerts.co.in/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">About Career Alerts</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Career Alerts is an independent job updates portal for freshers, interns, and experienced
        professionals in India. It is created and run by one person — Kerthana — not by a company
        or a content farm.
      </p>

      <div className="prose prose-lg mt-10 max-w-none text-foreground/90">
        <h2>Who runs Career Alerts</h2>
        <p>
          Everything you see here — finding openings, writing the listings, publishing them, and
          removing expired ones — is done by Kerthana. There is no editorial team and no automated
          scraper behind the scenes. That means fewer posts than a large aggregator, but each one
          is read by a human before it goes live, and there is a single person accountable for
          anything that is wrong.
        </p>

        <h2>Why it exists</h2>
        <p>
          Job updates for students and freshers are scattered across company career pages, social
          posts, and groups that often repost outdated or misleading openings. Career Alerts exists
          to collect genuine openings in one place and send you straight to the official
          application page — no middlemen, no paid shortcuts, no fees.
        </p>

        <h2>How a listing is checked before publishing</h2>
        <ol>
          <li>
            The opening is found from a public source — the company&apos;s own careers page, its
            official social/hiring post, or a link shared with us.
          </li>
          <li>
            The apply link is opened and confirmed to be an official company or official
            recruitment-platform URL. Listings without a working official link are not published.
          </li>
          <li>
            Details shown on the page — role, company, location, qualification, experience, and
            salary where stated — are copied from that official source. Anything the company has
            not stated is left blank or marked &quot;Not disclosed&quot; rather than guessed.
          </li>
          <li>
            Anything asking candidates for money, registration charges, or training fees is not
            published.
          </li>
          <li>
            Listings are revisited over time; when a posting closes or the link stops working, it
            is updated or removed.
          </li>
        </ol>
        <p>
          Career Alerts is not a recruitment agency and is not involved in the hiring decision.
          Always confirm the final details on the company&apos;s official page before you apply.
          Read the full{" "}
          <Link to="/editorial-policy">editorial and corrections policy</Link>.
        </p>

        <h2>Found something wrong?</h2>
        <p>
          If a listing is inaccurate, expired, or looks fraudulent, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the job link. Corrections are
          the fastest way to make this site better for everyone. You can also reach out through the{" "}
          <Link to="/contact">contact page</Link>.
        </p>
      </div>

      <ScamWarning className="mt-10" />
    </div>
  );
}
