export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function uniqueSlug(base: string): string {
  return `${slugify(base)}-${Math.random().toString(36).slice(2, 7)}`;
}