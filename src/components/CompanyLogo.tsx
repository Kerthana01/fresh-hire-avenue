import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  logo?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { box: "h-10 w-10 rounded-lg p-1", text: "text-[10px]", icon: "h-4 w-4" },
  md: { box: "h-14 w-14 rounded-xl p-1.5", text: "text-sm", icon: "h-5 w-5" },
  lg: { box: "h-16 w-16 rounded-2xl p-2", text: "text-base", icon: "h-6 w-6" },
};

export function CompanyLogo({ name, logo, size = "md", className }: CompanyLogoProps) {
  const s = sizeMap[size];
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden border border-border bg-white dark:bg-muted font-bold text-muted-foreground",
        s.box,
        s.text,
        className,
      )}
    >
      {logo ? (
        <img
          src={logo}
          alt={`${name} logo`}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      ) : name ? (
        <span>{initials}</span>
      ) : (
        <Building2 className={cn("text-muted-foreground", s.icon)} />
      )}
    </div>
  );
}