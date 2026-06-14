import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/jobs/")({
  component: AdminJobsList,
});

function AdminJobsList() {
  const qc = useQueryClient();
  const jobs = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id,slug,company_name,job_title,is_published,is_featured,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Job deleted");
      qc.invalidateQueries({ queryKey: ["admin", "jobs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        <Button asChild>
          <Link to="/admin/jobs/new"><Plus className="mr-1 h-4 w-4" /> New job</Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/70 bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Posted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {jobs.isLoading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : (jobs.data?.length ?? 0) === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No jobs yet. Create your first one.</td></tr>
            ) : (
              jobs.data!.map((j) => (
                <tr key={j.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium">{j.job_title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{j.company_name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={j.is_published ? "default" : "outline"}>
                      {j.is_published ? "Live" : "Draft"}
                    </Badge>
                    {j.is_featured && <Badge variant="secondary" className="ml-1">Featured</Badge>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(j.created_at), "MMM d")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/admin/jobs/$id" params={{ id: j.id }}><Pencil className="h-3.5 w-3.5" /></Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete "${j.job_title}"?`)) del.mutate(j.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}