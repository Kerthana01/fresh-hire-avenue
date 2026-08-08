/**
 * Isomorphic HTML sanitizer.
 * DOMPurify requires a DOM, so it throws during SSR. This allowlist-based
 * sanitizer runs identically on server and client, keeping the markup in the
 * initial HTML response (crawler-visible) and hydration-stable.
 */
const ALLOWED_TAGS = new Set([
  "p","br","strong","b","em","i","u","s","ul","ol","li",
  "h2","h3","h4","blockquote","code","pre","a","span","div","hr","table","thead","tbody","tr","th","td",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
};

function sanitizeAttrs(tag: string, raw: string): string {
  const allowed = ALLOWED_ATTRS[tag];
  if (!allowed) return "";
  let out = "";
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    const name = m[1]!.toLowerCase();
    const value = (m[3] ?? m[4] ?? m[5] ?? "").trim();
    if (!allowed.has(name)) continue;
    if (name === "href") {
      const v = value.replace(/\s+/g, "").toLowerCase();
      if (/^(javascript|data|vbscript):/.test(v)) continue;
    }
    out += ` ${name}="${value.replace(/"/g, "&quot;")}"`;
  }
  if (tag === "a" && /target=/.test(out) && !/rel=/.test(out)) {
    out += ' rel="noopener noreferrer"';
  }
  return out;
}

export function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return "";
  let html = String(input)
    // drop dangerous elements together with their content
    .replace(/<\s*(script|style|iframe|object|embed|noscript|template)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed)\b[^>]*\/?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  html = html.replace(/<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^>])*)>/g,
    (_full, closing: string, rawTag: string, attrs: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (closing) return `</${tag}>`;
      const selfClosing = tag === "br" || tag === "hr";
      return `<${tag}${sanitizeAttrs(tag, attrs)}${selfClosing ? " /" : ""}>`;
    });

  return html;
}
