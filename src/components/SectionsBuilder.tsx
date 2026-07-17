import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

export interface CustomSection {
  title: string;
  content: string;
}

interface Props {
  value: CustomSection[];
  onChange: (next: CustomSection[]) => void;
}

export function SectionsBuilder({ value, onChange }: Props) {
  const update = (i: number, patch: Partial<CustomSection>) => {
    onChange(value.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { title: "", content: "" }]);

  return (
    <div className="rounded-xl border border-border/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Additional Content Sections</h3>
          <p className="text-xs text-muted-foreground">Add any custom sections (Benefits, FAQs, Interview Prep, etc.). Reorder and delete freely. Empty sections are skipped.</p>
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={add}>
          <Plus className="mr-1 h-4 w-4" /> Add Section
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
          No custom sections yet. Click “Add Section” to create one.
        </p>
      ) : (
        <ol className="space-y-4">
          {value.map((s, i) => (
            <li key={i} className="rounded-lg border border-border/70 bg-background p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">#{i + 1}</span>
                <div className="ml-auto flex items-center gap-1">
                  <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move down">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => remove(i)} aria-label="Delete section">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Section title</Label>
                  <Input value={s.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="e.g. Benefits, Interview Preparation, FAQs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Section content</Label>
                  <RichTextEditor value={s.content} onChange={(html) => update(i, { content: html })} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function normalizeSections(raw: unknown): CustomSection[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s): CustomSection | null => {
      if (!s || typeof s !== "object") return null;
      const title = typeof (s as { title?: unknown }).title === "string" ? (s as { title: string }).title : "";
      const content = typeof (s as { content?: unknown }).content === "string" ? (s as { content: string }).content : "";
      return { title, content };
    })
    .filter((s): s is CustomSection => s !== null);
}