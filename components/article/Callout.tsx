import { Info, AlertTriangle, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "info" | "warning" | "tip";

const config: Record<
  Variant,
  {
    icon: typeof Info;
    bg: string;
    ring: string;
    iconColor: string;
    label: string;
  }
> = {
  info: {
    icon: Info,
    bg: "bg-info",
    ring: "ring-info-foreground/20",
    iconColor: "text-info-foreground",
    label: "Note",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning",
    ring: "ring-warning-foreground/20",
    iconColor: "text-warning-foreground",
    label: "Warning",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-tip",
    ring: "ring-tip-foreground/20",
    iconColor: "text-tip-foreground",
    label: "Tip",
  },
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, bg, ring, iconColor, label } = config[type];
  return (
    <aside className={`my-6 flex gap-3 rounded-xl ${bg} p-4 ring-1 ${ring}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} />
      <div className={`min-w-0 ${iconColor}`}>
        <div className="text-sm font-semibold">{title ?? label}</div>
        <div className="mt-1 text-sm leading-relaxed opacity-90">{children}</div>
      </div>
    </aside>
  );
}
