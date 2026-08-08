import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  logo?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Set for above-the-fold logos so they are not lazy-loaded. */
  priority?: boolean;
}

const sizeMap = {
  sm: { box: "h-10 w-10 rounded-lg p-1", text: "text-[10px]", icon: "h-4 w-4", px: 40 },
  md: { box: "h-14 w-14 rounded-xl p-1.5", text: "text-sm", icon: "h-5 w-5", px: 56 },
  lg: { box: "h-16 w-16 rounded-2xl p-2", text: "text-base", icon: "h-6 w-6", px: 64 },
};

/** Only self-hosted images are rendered; anything else falls back to initials. */
function selfHosted(logo?: string | null) {
  if (!logo) return null;
  const v = logo.trim();
  if (v.startsWith("/")) return v;
  if (v.startsWith("https://careeralerts.co.in/")) return v;
  return null;
}

export function CompanyLogo({ name, logo, size = "md", className, priority }: CompanyLogoProps) {
  const s = sizeMap[size];
  const initials = name.trim().slice(0, 2).toUpperCase();
  const src = selfHosted(logo);
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden border border-border bg-white dark:bg-muted font-bold text-muted-foreground",
        s.box,
        s.text,
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={`${name.trim()} logo`}
          width={s.px}
          height={s.px}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-contain"
        />
      ) : name.trim() ? (
        <span>{initials}</span>
      ) : (
        <Building2 className={cn("text-muted-foreground", s.icon)} />
      )}
    </div>
  );
}