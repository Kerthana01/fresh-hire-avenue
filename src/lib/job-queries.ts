import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { JobCardData } from "@/components/JobCard";
import { slugify } from "@/lib/slug";

const CARD_FIELDS =
  "slug,company_name,company_logo,job_title,location,experience,salary,created_at,is_featured";

export const PAGE_SIZE = 12;

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const latestJobsQuery = queryOptions({
  queryKey: ["jobs", "latest"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select(CARD_FIELDS)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) throw error;
    return (data ?? []) as JobCardData[];
  },
});

export const trendingJobsQuery = queryOptions({
  queryKey: ["jobs", "trending"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("slug,company_name,job_title")
      .eq("is_published", true)
      .eq("is_trending", true)
      .order("created_at", { ascending: false })
      .limit(6);
    if (error) throw error;
    return data ?? [];
  },
});

export const featuredCompaniesQuery = queryOptions({
  queryKey: ["companies", "featured"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("company_name,company_logo")
      .eq("is_published", true);
    if (error) throw error;
    const map = new Map<string, { name: string; logo: string | null; count: number }>();
    for (const row of data ?? []) {
      const key = slugify(row.company_name);
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.logo && row.company_logo) existing.logo = row.company_logo;
      } else {
        map.set(key, { name: row.company_name, logo: row.company_logo, count: 1 });
      }
    }
    return Array.from(map.entries())
      .map(([slug, v]) => ({ slug, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  },
});

export type JobsListParams = { q?: string; category?: string; page: number };

export const jobsListQuery = ({ q, category, page }: JobsListParams) =>
  queryOptions({
    queryKey: ["jobs", "list", q ?? "", category ?? "", page],
    queryFn: async () => {
      let categoryId: string | null = null;
      if (category) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", category)
          .maybeSingle();
        categoryId = cat?.id ?? null;
      }

      let builder = supabase
        .from("jobs")
        .select(`${CARD_FIELDS},category_id`, { count: "exact" })
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (q) {
        const like = `%${q}%`;
        builder = builder.or(
          `job_title.ilike.${like},company_name.ilike.${like},location.ilike.${like}`,
        );
      }
      if (categoryId) builder = builder.eq("category_id", categoryId);

      const { data, count, error } = await builder;
      if (error) throw error;
      return { items: (data ?? []) as JobCardData[], count: count ?? 0 };
    },
  });

export const categoryBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const categoryJobsQuery = (categoryId: string | undefined) =>
  queryOptions({
    queryKey: ["category-jobs", categoryId ?? ""],
    queryFn: async () => {
      if (!categoryId) return [] as JobCardData[];
      const { data, error } = await supabase
        .from("jobs")
        .select(CARD_FIELDS)
        .eq("is_published", true)
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as JobCardData[];
    },
  });

export const allPublishedJobsQuery = queryOptions({
  queryKey: ["jobs", "all-published"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select(CARD_FIELDS)
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as JobCardData[];
  },
});