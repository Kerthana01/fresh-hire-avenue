import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/subscribers")({
  component: SubscribersPage,
});

function SubscribersPage() {
  const subs = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const exportCsv = () => {
    if (!subs.data) return;
    // Neutralise CSV/spreadsheet formula injection: any cell beginning with
    // =, +, -, @, tab, or CR is treated as a formula by Excel/Calc.
    const safeCell = (v: string) => {
      const s = String(v ?? "");
      return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    };
    const csv = [
      "email,subscribed_at",
      ...subs.data.map((s) => `${safeCell(s.email)},${safeCell(s.created_at)}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Subscribers</h1>
        <button onClick={exportCsv} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted">
          Export CSV
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/70 bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {(subs.data ?? []).map((s) => (
              <tr key={s.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{format(new Date(s.created_at), "PPpp")}</td>
              </tr>
            ))}
            {subs.data?.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-10 text-center text-muted-foreground">No subscribers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}