import {
  ShieldCheck,
  BookOpen,
  Smartphone,
  BatteryCharging,
  Store,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  // Categories that use real icons instead of monograms
  "carta-app":                  Smartphone,
  "wireless-charger":           BatteryCharging,
  "focus-v-wholesale":          Store,
  "focus-v-polices-conditions": ShieldCheck,
};

/** Monogram map: category slug → short display label */
const monograms: Record<string, string> = {
  "aeris":                 "AER",
  "carta-2":               "C2",
  "carta-sport":           "CS",
  "intelli-core-max":      "MAX",
  "intelli-core-standard": "IC",
  "saber":                 "SAB",
  "carta-classic":         "CC",
  "carta-original":        "OG",
  "carta-og-classic":      "OG",
};

export function CategoryIcon({
  name,
  className = "h-5 w-5",
  slug,
}: {
  name: string;
  className?: string;
  slug?: string;
}) {
  const key = slug ?? name;

  // Real icon categories
  const Icon = iconMap[key];
  if (Icon) return <Icon className={className} />;

  // Monogram categories
  const monogram = monograms[key];
  if (monogram) {
    const isSmall = className.includes("h-4");
    return (
      <span
        className={`font-bold tracking-tight leading-none ${isSmall ? "text-[9px]" : "text-xs"}`}
        aria-hidden="true"
      >
        {monogram}
      </span>
    );
  }

  // Fallback
  return <BookOpen className={className} />;
}
