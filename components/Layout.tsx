"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Moon,
  Sun,
  Search,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  LifeBuoy,
  MessageSquarePlus,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { SearchBar } from "./SearchBar";
import { categories } from "@/lib/articles";
import { CategoryIcon } from "./CategoryIcon";
import FeedbackWidget from "./FeedbackWidget";

const navLinks = [
  { to: "/", label: "Home" },
] as const;

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/60 text-foreground transition-colors hover:bg-muted"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function DevicesMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = pathname.startsWith("/category/");

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active || open
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Devices
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-[640px] -translate-x-1/2 rounded-xl border border-border bg-popover p-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-1">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-card text-accent">
                  <CategoryIcon name={c.icon} slug={c.slug} className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {c.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {c.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-2 border-t border-border pt-2">
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Browse all articles
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const active =
              l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                href={l.to}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[21px] h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
          <DevicesMenu pathname={pathname} />
        </nav>

        {/* Inline search on desktop */}
        <div className="ml-2 hidden flex-1 max-w-md lg:block">
          <SearchBar size="sm" placeholder="Search help articles…" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/60 text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => setFeedbackOpen(true)}
            aria-label="Submit feedback"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/60 text-foreground transition-colors hover:bg-muted"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <a
            href="https://focusv.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:inline-flex"
          >
            Shop Focus V
          </a>
          <Link
            href="/contact"
            className="hidden h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:opacity-90 sm:inline-flex"
          >
            <LifeBuoy className="h-4 w-4" />
            Contact
          </Link>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/60 text-foreground transition-colors hover:bg-muted md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-background/95 px-4 py-3 sm:px-6 lg:hidden lg:px-8">
          <div className="mx-auto max-w-3xl">
            <SearchBar size="md" autoFocus />
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Contact Support
            </Link>
            <a
              href="https://focusv.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Shop Focus V
            </a>
            <div className="mt-2 px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Devices
            </div>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <CategoryIcon name={c.icon} slug={c.slug} className="h-4 w-4 text-accent" />
                  <span className="truncate">{c.title}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
      <FeedbackWidget open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/30">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a
            href="https://focusv.com"
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            focusv.com <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://portal.focusv.com"
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            Warranty Portal <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="mailto:support@focusv.com"
            className="transition-colors hover:text-foreground"
          >
            support@focusv.com
          </a>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Focus V. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
