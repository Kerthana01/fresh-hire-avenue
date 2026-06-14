import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobForm, type JobFormValues } from "@/components/JobForm";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/jobs/$id")({
  component: EditJobPage,
});

function EditJobPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const job = useQuery({
    queryKey: ["admin", "job", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const initial: JobFormValues | undefined = job.data
    ? {
        id: job.data.id,
        slug: job.data.slug,
        company_name: job.data.company_name,
        company_logo: job.data.company_logo ?? "",
        job_title: job.data.job_title,
        job_description: job.data.job_description,
        responsibilities: job.data.responsibilities ?? "",
        eligibility: job.data.eligibility ?? "",
        qualification: job.data.qualification ?? "",
        skills: job.data.skills ?? "",
        experience: job.data.experience ?? "",
        salary: job.data.salary ?? "",
        location: job.data.location ?? "",
        selection_process: job.data.selection_process ?? "",
        apply_link: job.data.apply_link,
        category_id: job.data.category_id,
        last_date: job.data.last_date ?? "",
        is_featured: job.data.is_featured,
        is_trending: job.data.is_trending,
        is_published: job.data.is_published,
        meta_title: job.data.meta_title ?? "",
        meta_description: job.data.meta_description ?? "",
      }
    : undefined;

  const submit = async (v: JobFormValues) => {
    setBusy(true);
    const { error } = await supabase
      .from("jobs")
      .update({
        slug: v.slug,
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
      })
      .eq("id", id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Job updated");
    navigate({ to: "/admin/jobs" });
  };

  if (job.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!initial) return <p className="text-muted-foreground">Not found.</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Edit job</h1>
      <JobForm initial={initial} onSubmit={submit} submitting={busy} />
    </div>
  );
}