import Link from "next/link";
import { notFound } from "next/navigation";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { CategoryIcon } from "@/components/CategoryIcon";
import { articlesInCategory, categories, getCategory } from "@/lib/articles";
import { ArrowRight, ChevronRight, Clock } from "lucide-react";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  return {
    title: cat ? `${cat.title} — Focus V Help Center` : "Category — Focus V Help",
    description: cat?.description ?? "Focus V help articles.",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const list = articlesInCategory(cat.slug);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{cat.title}</span>
        </nav>

        <header className="mt-6 border-b border-border pb-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                  <CategoryIcon name={cat.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {cat.title}
                  </h1>
                  <p className="mt-1 text-muted-foreground">{cat.description}</p>
                </div>
              </div>
              <div className="max-w-2xl">
                <SearchBar
                  size="md"
                  placeholder={`Search ${cat.title.toLowerCase()}…`}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {list.length} {list.length === 1 ? "article" : "articles"}
            </h2>
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/40">
              {list.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No articles in this category yet. Check back soon.
                </li>
              )}
              {list.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/article/${a.slug}`}
                    className="group flex items-start justify-between gap-6 px-5 py-5 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                        {a.title}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {a.summary}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {a.readTime} min
                      </span>
                      <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card/40 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Other categories
              </h3>
              <ul className="mt-3 space-y-1">
                {categories
                  .filter((c) => c.slug !== cat.slug)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/category/${c.slug}`}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <CategoryIcon
                          name={c.icon}
                          className="h-4 w-4 text-accent"
                        />
                        {c.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
