// Shared JSON-LD builders for Career Alerts.
// All schemas use absolute URLs and follow Google Rich Results guidelines.

export const SITE_URL = "https://careeralerts.co.in";
export const SITE_NAME = "Career Alerts";
export const SITE_LOGO = `${SITE_URL}/og-image.jpg`;
export const CONTACT_EMAIL = "hello@careeralerts.co.in";

export const SOCIAL_PROFILES = [
  "https://www.linkedin.com/company/career-alerts",
  "https://x.com/careeralerts_in",
  "https://www.instagram.com/careeralerts.in",
  "https://www.youtube.com/@careeralerts",
  "https://whatsapp.com/channel/0029VbCFVJ7BA1euBgf2UV34",
];

// --- Title helpers -------------------------------------------------------
// Strip tabs, newlines, zero-width and other control characters, collapse
// runs of whitespace and trim. Used everywhere a title is rendered.
export function cleanTitle(value?: string | null): string {
  return (value ?? "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Headline for a job: "Title at Company". Falls back to a company/location
 * pattern when the job title is missing so we never render "X at X".
 */
export function jobHeadline(job: {
  job_title?: string | null;
  company_name?: string | null;
  location?: string | null;
}): string {
  const title = cleanTitle(job.job_title);
  const company = cleanTitle(job.company_name);
  const location = cleanTitle(job.location);
  if (title && company && title.toLowerCase() !== company.toLowerCase()) {
    return `${title} at ${company}`;
  }
  if (title) return title;
  if (company) return location ? `Hiring at ${company} – ${location}` : `Hiring at ${company}`;
  return "Job Opening";
}

/** Category label that never duplicates the word "Jobs". */
export function categoryLabel(name?: string | null): string {
  const clean = cleanTitle(name);
  if (!clean) return "Jobs";
  return /\bjobs?\b/i.test(clean) ? clean : `${clean} Jobs`;
}

// Escape HTML/script-breaking sequences in a value destined for a
// <script type="application/ld+json"> tag. JSON.stringify does not escape
// `<`, `>`, or `/`, so a value containing `</script>` would terminate the
// script element in the browser's HTML parser and enable XSS.
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/<\/script/gi, "<\\/script")
    .replace(/<!--/g, "<\\!--");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    email: CONTACT_EMAIL,
    sameAs: SOCIAL_PROFILES,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT_EMAIL,
        availableLanguage: ["English", "Hindi", "Tamil"],
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Find verified freshers jobs, internships, off-campus drives and hiring opportunities from top companies across India.",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/jobs?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function collectionPageSchema(input: {
  name: string;
  description: string;
  url: string;
  items?: { name: string; url: string }[];
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
  if (input.items && input.items.length > 0) {
    schema.mainEntity = {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: it.url,
      })),
    };
  }
  return schema;
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };
}

// Detect employmentType from text. Google accepts:
// FULL_TIME | PART_TIME | CONTRACTOR | TEMPORARY | INTERN | VOLUNTEER | PER_DIEM | OTHER
export function detectEmploymentType(...sources: (string | null | undefined)[]): string[] {
  const text = sources.filter(Boolean).join(" ").toLowerCase();
  const types: string[] = [];
  if (/\bintern(ship)?\b/.test(text)) types.push("INTERN");
  if (/\bpart[\s-]?time\b/.test(text)) types.push("PART_TIME");
  if (/\bcontract(or)?\b/.test(text)) types.push("CONTRACTOR");
  if (/\btemporary|temp\b/.test(text)) types.push("TEMPORARY");
  if (types.length === 0) types.push("FULL_TIME");
  return types;
}

export function isRemoteLocation(location?: string | null): boolean {
  if (!location) return false;
  return /remote|work\s*from\s*home|\bwfh\b|anywhere/i.test(location);
}

// Try to parse a salary string like "₹6 - 12 LPA", "300000-500000", "6 LPA",
// "$80,000 - $100,000". Returns null when no numeric value found.
export function parseSalary(
  raw?: string | null,
): { currency: string; min: number; max: number; unit: "YEAR" | "MONTH" | "HOUR" } | null {
  if (!raw) return null;
  const s = raw.replace(/,/g, "");
  // Skip values that are clearly not officially published / are estimates.
  if (
    /not\s*disclosed|undisclosed|not\s*specified|negotiable|best\s*in\s*industry|as\s*per\s*(company|industry|norms)|depend(s|ing)|competitive|market\s*standard|estimat/i.test(
      s,
    )
  ) {
    return null;
  }
  const currency = /\$/.test(s) ? "USD" : /€/.test(s) ? "EUR" : /£/.test(s) ? "GBP" : "INR";
  const lpa = /lpa|lakh|per\s*annum|\/\s*year|annually/i.test(s);
  const lakh = /lakh|lpa/i.test(s);
  const monthly = /\/\s*month|per\s*month|monthly|pm\b/i.test(s);
  const hourly = /\/\s*hour|per\s*hour|hourly|\/hr/i.test(s);
  const nums = Array.from(s.matchAll(/(\d+(?:\.\d+)?)/g)).map((m) => parseFloat(m[1]));
  if (nums.length === 0) return null;
  let min = nums[0];
  let max = nums[nums.length - 1];
  if (lakh) {
    min *= 100000;
    max *= 100000;
  }
  const unit: "YEAR" | "MONTH" | "HOUR" = hourly ? "HOUR" : monthly ? "MONTH" : lpa ? "YEAR" : "YEAR";
  return { currency, min, max, unit };
}

// Convert a free-text experience requirement (e.g. "Freshers", "0-2 years",
// "2+ yrs", "Minimum 3 years") into Google's structured
// OccupationalExperienceRequirements with monthsOfExperience. Returns null
// when no numeric experience can be derived.
export function parseExperienceMonths(raw?: string | null): number | null {
  if (!raw) return null;
  const s = raw.toLowerCase().trim();
  if (!s) return null;
  if (/fresher|fresh\s*graduate|entry[\s-]*level|no\s*experience|0\s*(?:year|yr)/i.test(s)) {
    return 0;
  }
  const nums = Array.from(s.matchAll(/(\d+(?:\.\d+)?)/g)).map((m) => parseFloat(m[1]));
  if (nums.length === 0) return null;
  const years = Math.min(...nums); // Google asks for the minimum required
  if (!Number.isFinite(years) || years < 0) return null;
  return Math.round(years * 12);
}

// Extract { addressLocality, addressRegion } from a free-text location like
// "Bengaluru, Karnataka" or "Remote, India". Returns only the fields we can
// verify from the input — never fabricates streetAddress / postalCode.
function parseAddress(location: string): { addressLocality?: string; addressRegion?: string } {
  const parts = location
    .split(/[,/|]+/)
    .map((p) => p.trim())
    .filter((p) => p && !/^india$/i.test(p) && !/^remote|wfh|work\s*from\s*home|anywhere$/i.test(p));
  if (parts.length === 0) return {};
  if (parts.length === 1) return { addressLocality: parts[0] };
  return { addressLocality: parts[0], addressRegion: parts[1] };
}

// Strip undefined / null / empty-string / empty-object values so the emitted
// JSON-LD only contains verifiable fields.
function pruneSchema<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => pruneSchema(v)).filter((v) => v !== undefined) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const pv = pruneSchema(v);
      if (pv === undefined || pv === null) continue;
      if (typeof pv === "string" && pv.trim() === "") continue;
      if (typeof pv === "object" && !Array.isArray(pv) && Object.keys(pv as object).length === 0) continue;
      if (Array.isArray(pv) && pv.length === 0) continue;
      out[k] = pv;
    }
    return out as T;
  }
  return value;
}

export function jobPostingSchema(job: {
  id: string;
  slug: string;
  job_title: string;
  job_description: string;
  company_name: string;
  company_logo: string | null;
  location: string | null;
  experience: string | null;
  salary: string | null;
  created_at: string;
  last_date: string | null;
  apply_link: string;
  qualification?: string | null;
  skills?: string | null;
}) {
  const remote = isRemoteLocation(job.location);
  const employmentType = detectEmploymentType(job.job_title, job.experience);
  const salary = parseSalary(job.salary);
  const absoluteLogo =
    job.company_logo && /^https?:\/\//i.test(job.company_logo) ? job.company_logo : SITE_LOGO;
  const directApply = /^https?:\/\//i.test(job.apply_link);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: cleanTitle(job.job_title) || jobHeadline(job),
    description: `<p>${escapeHtml(job.job_description).replace(/\n+/g, "</p><p>")}</p>`,
    datePosted: new Date(job.created_at).toISOString(),
    employmentType,
    identifier: {
      "@type": "PropertyValue",
      name: job.company_name,
      value: job.id,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: job.company_name,
      sameAs: `${SITE_URL}/company/${(job.company_name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
      logo: absoluteLogo,
    },
    url: `${SITE_URL}/jobs/${job.slug}`,
    directApply,
  };

  if (job.last_date) {
    const d = new Date(job.last_date);
    if (!isNaN(d.getTime())) schema.validThrough = d.toISOString();
  }

  if (remote) {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = {
      "@type": "Country",
      name: "IN",
    };
  } else if (job.location) {
    // Only emit address fields we can verify from the source text — never
    // synthesize streetAddress or postalCode.
    const parsed = parseAddress(job.location);
    schema.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...parsed,
        addressCountry: "IN",
      },
    };
  } else {
    // Google requires either jobLocation or applicantLocationRequirements.
    schema.applicantLocationRequirements = { "@type": "Country", name: "IN" };
  }

  // Only publish baseSalary when the employer's salary text contains a real
  // numeric range/value (parseSalary returns null for "Not disclosed",
  // "Negotiable", "Best in industry", estimates, etc.).
  if (salary) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: salary.currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: salary.min,
        maxValue: salary.max,
        unitText: salary.unit,
      },
    };
  }

  if (job.qualification) schema.educationRequirements = job.qualification;
  if (job.experience) {
    const months = parseExperienceMonths(job.experience);
    if (months !== null) {
      // Schema.org compliant structured value. Original free text remains
      // visible on the page for users.
      schema.experienceRequirements = {
        "@type": "OccupationalExperienceRequirements",
        monthsOfExperience: months,
      };
      if (months === 0) schema.experienceInPlaceOfEducation = false;
    }
  }
  if (job.skills) schema.skills = job.skills;

  return pruneSchema(schema);
}