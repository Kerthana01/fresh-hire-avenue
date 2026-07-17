import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { slugify, uniqueSlug } from "@/lib/slug";
import { SectionsBuilder, type CustomSection } from "@/components/SectionsBuilder";

export interface JobFormValues {
  id?: string;
  slug?: string;
  company_name: string;
  company_logo: string;
  job_title: string;
  job_description: string;
  responsibilities: string;
  eligibility: string;
  qualification: string;
  skills: string;
  experience: string;
  salary: string;
  location: string;
  selection_process: string;
  apply_link: string;
  category_id: string | null;
  last_date: string;
  is_featured: boolean;
  is_trending: boolean;
  is_published: boolean;
  meta_title: string;
  meta_description: string;
  custom_sections: CustomSection[];
}

export const emptyJob: JobFormValues = {
  company_name: "", company_logo: "", job_title: "", job_description: "",
  responsibilities: "", eligibility: "", qualification: "", skills: "",
  experience: "", salary: "", location: "", selection_process: "",
  apply_link: "", category_id: null, last_date: "",
  is_featured: false, is_trending: false, is_published: true,
  meta_title: "", meta_description: "",
  custom_sections: [],
};

interface Props {
  initial?: JobFormValues;
  onSubmit: (values: JobFormValues) => Promise<void>;
  submitting: boolean;
}

export function JobForm({ initial, onSubmit, submitting }: Props) {
  const [v, setV] = useState<JobFormValues>(initial ?? emptyJob);

  useEffect(() => { if (initial) setV(initial); }, [initial]);

  const cats = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const set = <K extends keyof JobFormValues>(k: K, val: JobFormValues[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalValues = {
      ...v,
      slug: v.slug || uniqueSlug(`${v.company_name}-${v.job_title}`),
    };
    await onSubmit(finalValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company name *"><Input required value={v.company_name} onChange={(e) => set("company_name", e.target.value)} /></Field>
        <Field label="Job title *"><Input required value={v.job_title} onChange={(e) => set("job_title", e.target.value)} /></Field>
        <Field label="Company logo URL"><Input value={v.company_logo} onChange={(e) => set("company_logo", e.target.value)} placeholder="https://…" /></Field>
        <Field label="Apply link *"><Input required type="url" value={v.apply_link} onChange={(e) => set("apply_link", e.target.value)} placeholder="https://…" /></Field>
        <Field label="Location"><Input value={v.location} onChange={(e) => set("location", e.target.value)} /></Field>
        <Field label="Experience"><Input value={v.experience} onChange={(e) => set("experience", e.target.value)} placeholder="0-2 years" /></Field>
        <Field label="Salary"><Input value={v.salary} onChange={(e) => set("salary", e.target.value)} placeholder="₹6 LPA" /></Field>
        <Field label="Qualification"><Input value={v.qualification} onChange={(e) => set("qualification", e.target.value)} placeholder="B.E./B.Tech" /></Field>
        <Field label="Last date">
          <Input type="date" value={v.last_date} onChange={(e) => set("last_date", e.target.value)} />
        </Field>
        <Field label="Category">
          <Select value={v.category_id ?? "none"} onValueChange={(val) => set("category_id", val === "none" ? null : val)}>
            <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {(cats.data ?? []).map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Job description *">
        <Textarea required rows={5} value={v.job_description} onChange={(e) => set("job_description", e.target.value)} />
      </Field>
      <Field label="Responsibilities">
        <Textarea rows={3} value={v.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} />
      </Field>
      <Field label="Eligibility">
        <Textarea rows={3} value={v.eligibility} onChange={(e) => set("eligibility", e.target.value)} />
      </Field>
      <Field label="Skills">
        <Textarea rows={2} value={v.skills} onChange={(e) => set("skills", e.target.value)} placeholder="React, Node.js, SQL" />
      </Field>
      <Field label="Selection process">
        <Textarea rows={3} value={v.selection_process} onChange={(e) => set("selection_process", e.target.value)} />
      </Field>

      <SectionsBuilder value={v.custom_sections} onChange={(next) => set("custom_sections", next)} />

      <div className="rounded-xl border border-border/70 p-4">
        <h3 className="mb-3 text-sm font-semibold">Visibility & SEO</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug (optional)"><Input value={v.slug ?? ""} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="auto-generated" /></Field>
          <Field label="Meta title"><Input value={v.meta_title} onChange={(e) => set("meta_title", e.target.value)} /></Field>
          <Field label="Meta description"><Input value={v.meta_description} onChange={(e) => set("meta_description", e.target.value)} /></Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <SwitchRow label="Published" value={v.is_published} onChange={(b) => set("is_published", b)} />
          <SwitchRow label="Featured" value={v.is_featured} onChange={(b) => set("is_featured", b)} />
          <SwitchRow label="Trending" value={v.is_trending} onChange={(b) => set("is_trending", b)} />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Saving…" : "Save job"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function SwitchRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Switch checked={value} onCheckedChange={onChange} /> {label}
    </label>
  );
}