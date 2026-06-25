import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { slugify } from "@/lib/slug";

const BASE_URL = "https://careeralerts.co.in";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const [jobs, cats] = await Promise.all([
          supabaseAdmin.from("jobs").select("slug,updated_at,company_name").eq("is_published", true),
          supabaseAdmin.from("categories").select("slug"),
        ]);

        const companySlugs = Array.from(
          new Set((jobs.data ?? []).map((j) => slugify(j.company_name))),
        );

        const staticPaths = [
          { path: "/", priority: "1.0", changefreq: "daily" },
          { path: "/jobs", priority: "0.9", changefreq: "daily" },
          { path: "/about", priority: "0.5", changefreq: "monthly" },
          { path: "/contact", priority: "0.5", changefreq: "monthly" },
          { path: "/privacy", priority: "0.3", changefreq: "yearly" },
          { path: "/terms", priority: "0.3", changefreq: "yearly" },
          { path: "/disclaimer", priority: "0.3", changefreq: "yearly" },
        ];

        const entries = [
          ...staticPaths.map((s) => ({
            loc: `${BASE_URL}${s.path}`,
            changefreq: s.changefreq,
            priority: s.priority,
          })),
          ...((cats.data ?? []).map((c) => ({
            loc: `${BASE_URL}/categories/${c.slug}`,
            changefreq: "weekly",
            priority: "0.7",
          }))),
          ...companySlugs.map((s) => ({
            loc: `${BASE_URL}/company/${s}`,
            changefreq: "weekly",
            priority: "0.7",
          })),
          ...((jobs.data ?? []).map((j) => ({
            loc: `${BASE_URL}/jobs/${j.slug}`,
            lastmod: j.updated_at,
            changefreq: "weekly",
            priority: "0.8",
          }))),
        ];

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) =>
            [
              "  <url>",
              `    <loc>${e.loc}</loc>`,
              "lastmod" in e && e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
              `    <changefreq>${e.changefreq}</changefreq>`,
              `    <priority>${e.priority}</priority>`,
              "  </url>",
            ].filter(Boolean).join("\n"),
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});