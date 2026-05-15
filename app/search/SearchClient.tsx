"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { categories, getCategory, articles } from "@/lib/articles";
import { ArrowRight, Clock, SearchX } from "lucide-react";
import Fuse from "fuse.js";
import { useMemo } from "react";

const fuse = new Fuse(articles, {
  keys: ["title", "summary"],
  threshold: 0.4,
  includeScore: true,
});

function highlight(snippet: string, q: string) {
  if (!q) return snippet;
  const i = snippet.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return snippet;
  return (
    <>
      {snippet.slice(0, i)}
      <mark className="rounded bg-accent/25 px-0.5 text-foreground">
        {snippet.slice(i, i + q.length)}
      </mark>
      {snippet.slice(i + q.length)}
    </>
  );
}

export function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return fuse.search(q).map((r) => ({
      article: r.item,
      snippet: r.item.summary,
    }));
  }, [q]);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Search
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {q ? (
          <>
            Showing results for{" "}
            <span className="text-foreground">&ldquo;{q}&rdquo;</span>
          </>
        ) : (
          "Type to search the help center."
        )}
      </p>
      <div className="mt-5">
        <SearchBar size="md" defaultValue={q} autoFocus />
      </div>

      {q && results.length > 0 && (
        <div className="mt-8 text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "result" : "results"}
        </div>
      )}

      {q && results.length > 0 && (
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/40">
          {results.map(({ article, snippet }) => {
            const cat = getCategory(article.category);
            return (
              <li key={article.slug}>
                <Link
                  href={`/article/${article.slug}`}
                  className="group block px-5 py-5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent ring-1 ring-accent/20">
                      {cat?.title}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" /> {article.readTime} min
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold transition-colors group-hover:text-accent">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {highlight(snippet, q)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {q && results.length === 0 && (
        <div className="mt-8 rounded-2xl border border-border bg-card/40 p-8 text-center">
          <SearchX className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">
            No results for &ldquo;{q}&rdquo;
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search term, or browse a category below.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2 text-left sm:grid-cols-3">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm hover:border-accent/40"
              >
                <span>{c.title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
