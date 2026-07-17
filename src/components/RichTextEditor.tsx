import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[160px] p-3 focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-md border border-input bg-background">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean, onClick: () => void, icon: React.ReactNode, label: string) => (
    <Button
      type="button"
      size="sm"
      variant={active ? "secondary" : "ghost"}
      onClick={onClick}
      aria-label={label}
      className="h-8 w-8 p-0"
    >
      {icon}
    </Button>
  );
  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border/70 p-1">
      {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <BoldIcon className="h-4 w-4" />, "Bold")}
      {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <ItalicIcon className="h-4 w-4" />, "Italic")}
      {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="h-4 w-4" />, "Heading 2")}
      {btn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="h-4 w-4" />, "Heading 3")}
      {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List className="h-4 w-4" />, "Bullet list")}
      {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-4 w-4" />, "Numbered list")}
      {btn(editor.isActive("link"), setLink, <LinkIcon className="h-4 w-4" />, "Add link")}
      {editor.isActive("link") &&
        btn(false, () => editor.chain().focus().unsetLink().run(), <Unlink className="h-4 w-4" />, "Remove link")}
    </div>
  );
}