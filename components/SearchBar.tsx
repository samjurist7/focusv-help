"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SearchBar({
  size = "md",
  defaultValue = "",
  placeholder = "Search articles, devices, fixes…",
  autoFocus = false,
}: {
  size?: "lg" | "md" | "sm";
  defaultValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const sizes = {
    lg: "h-16 text-lg pl-14 pr-5 rounded-2xl",
    md: "h-12 text-base pl-12 pr-4 rounded-xl",
    sm: "h-10 text-sm pl-10 pr-3 rounded-lg",
  } as const;
  const iconPos = {
    lg: "left-5 h-5 w-5",
    md: "left-4 h-4 w-4",
    sm: "left-3 h-4 w-4",
  } as const;

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground ${iconPos[size]}`}
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full border border-border bg-card/60 backdrop-blur transition-all placeholder:text-muted-foreground/70 focus:border-accent/60 focus:bg-card focus:outline-none focus:ring-4 focus:ring-accent/15 ${sizes[size]}`}
      />
      {size === "lg" && (
        <kbd className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground sm:flex">
          ⏎
        </kbd>
      )}
    </form>
  );
}
