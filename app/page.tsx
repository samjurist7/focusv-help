import Link from "next/link";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
  categories,
  articleCountByCategory,
  popularArticles,
  getCategory,
} from "@/lib/articles";
import { ArrowRight, Clock, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Focus V Help Center — Guides, troubleshooting & support",
  description:
    "Find answers fast. Setup guides, troubleshooting, cleaning, warranty, and more for every Focus V device.",
};

export default function HomePage() {
  const popular = popularArticles().slice(0, 6);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: "var(--accent)",
                boxShadow: "0 0 8px var(--accent)",
              }}
            />
            Focus V Help Center
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            How can we help?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Search guides for Carta, Aeris, Saber, and more. Get answers in
            seconds.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar size="lg" placeholder="How can we help?" />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span>Popular:</span>
            {["Carta 3 setup", "Won't turn on", "Cleaning", "Warranty"].map(
              (t) => (
                <Link
                  key={t}
                  href={`/search?q=${encodeURIComponent(t)}`}
                  className="rounded-full border border-border bg-card/40 px-2.5 py-1 transition-colors hover:border-accent/40 hover:text-foreground"
                >
                  {t}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Browse by category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Eight focused sections covering every part of your Focus V
              experience.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const count = articleCountByCategory(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-card"
              >
                <div className="relative flex h-32 w-full items-center justify-center border-b border-border bg-gradient-to-b from-muted/20 to-card">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
                    <CategoryIcon name={c.icon} className="h-6 w-6" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-foreground">
                      {c.title}
                    </h3>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {count} {count === 1 ? "article" : "articles"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {c.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Browse <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular articles */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Popular articles
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              What other Focus V users are reading right now.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {popular.map((a) => {
            const cat = getCategory(a.category);
            return (
              <Link
                key={a.slug}
                href={`/article/${a.slug}`}
                className="group rounded-2xl border border-border bg-card/40 p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-card"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent ring-1 ring-accent/20">
                    {cat?.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {a.readTime} min read
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
                  {a.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {a.summary}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                <MessageCircle className="h-3.5 w-3.5" /> Still need help?
              </div>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Talk to a real person.
              </h3>
              <p className="mt-2 text-pretty text-muted-foreground">
                Can&apos;t find what you need? Our support team responds fast —
                usually within a few hours.
              </p>
            </div>
            <a
              href="https://portal.focusv.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Contact Support <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
