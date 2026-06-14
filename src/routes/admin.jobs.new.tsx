import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JobForm, emptyJob, type JobFormValues } from "@/components/JobForm";
import { toast } from "sonner";
import { uniqueSlug } from "@/lib/slug";

export const Route = createFileRoute("/admin/jobs/new")({
  component: NewJobPage,
});

function NewJobPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const submit = async (v: JobFormValues) => {
    setBusy(true);
    const payload = {
      slug: v.slug || uniqueSlug(`${v.company_name}-${v.job_title}`),
      company_name: v.company_name,
      company_logo: v.company_logo || null,
      job_title: v.job_title,
      job_description: v.job_description,
      responsibilities: v.responsibilities || null,
      eligibility: v.eligibility || null,
      qualification: v.qualification || null,
      skills: v.skills || null,
      experience: v.experience || null,
      salary: v.salary || null,
      location: v.location || null,
      selection_process: v.selection_process || null,
      apply_link: v.apply_link,
      category_id: v.category_id,
      last_date: v.last_date || null,
      is_featured: v.is_featured,
      is_trending: v.is_trending,
      is_published: v.is_published,
      meta_title: v.meta_title || null,
      meta_description: v.meta_description || null,
    };
    const { error } = await supabase.from("jobs").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Job created");
    navigate({ to: "/admin/jobs" });
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">New job</h1>
      <JobForm initial={emptyJob} onSubmit={submit} submitting={busy} />
    </div>
  );
}