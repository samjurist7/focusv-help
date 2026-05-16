import {
  Rocket,
  Wrench,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Package,
  Smartphone,
  CreditCard,
  Flame,
  Cpu,
  Zap,
  CircuitBoard,
  Wand2,
  BatteryCharging,
  Store,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Rocket, Wrench, Sparkles, ShieldCheck, BookOpen, Package,
  Smartphone, CreditCard, Flame, Cpu, Zap, CircuitBoard,
  Wand2, BatteryCharging, Store,
};

/** Monogram map: category slug → short display label */
const monograms: Record<string, string> = {
  "aeris":                    "AER",
  "carta-2":                  "C2",
  "carta-sport":              "CS",
  "intelli-core-max":         "MAX",
  "intelli-core-standard":    "IC",
  "saber":                    "SAB",
  "carta-classic":            "CC",
  "carta-original":           "CO",
  "wireless-charger":         "WC",
  "carta-app":                "APP",
  "focus-v-wholesale":        "WHL",
  "focus-v-polices-conditions": "POL",
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
  const monogram = slug ? monograms[slug] : monograms[name];
  if (monogram) {
    // Scale font size based on className size hint
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
  const Icon = map[name] ?? BookOpen;
  return <Icon className={className} />;
}
