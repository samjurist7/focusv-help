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
};

export function CategoryIcon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? BookOpen;
  return <Icon className={className} />;
}
