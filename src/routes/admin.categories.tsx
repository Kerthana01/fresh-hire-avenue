import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const cats = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("categories").insert({
        name: name.trim(),
        slug: slugify(name),
        description: description.trim() || null,
        sort_order: (cats.data?.length ?? 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category added");
      setName(""); setDescription("");
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Categories</h1>
      <form
        onSubmit={(e) => { e.preventDefault(); if (name.trim()) create.mutate(); }}
        className="mb-6 grid gap-3 rounded-xl border border-border/70 bg-card p-4 sm:grid-cols-[1fr_1fr_auto]"
      >
        <div>
          <Label className="text-xs">Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AI/ML Jobs" />
        </div>
        <div>
          <Label className="text-xs">Description</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button type="submit" className="self-end" disabled={create.isPending || !name.trim()}>Add</Button>
      </form>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/70 bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(cats.data ?? []).map((c) => (
              <tr key={c.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">/{c.slug}</td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { if (confirm(`Delete "${c.name}"?`)) del.mutate(c.id); }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}