import Link from "next/link";
import { notFound } from "next/navigation";
import { Layout } from "@/components/Layout";
import { ArticleRenderer } from "@/components/article/ArticleRenderer";
import { articles, getArticle, getCategory, type Block, type HeadingBlock } from "@/lib/articles";
import { ChevronRight, Clock, CalendarDays, ArrowRight, MessageCircle } from "lucide-react";
import { MobileTOC, FeedbackSection } from "./ArticleClient";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  return {
    title: article ? `${article.title} — Focus V Help` : "Article — Focus V Help",
    description: article?.summary ?? "",
    openGraph: {
      title: article?.title ?? "Focus V Help",
      description: article?.summary ?? "",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const category = getCategory(article.category);

  const headings = (article.blocks as Block[]).filter(
    (b): b is HeadingBlock => b.type === "heading" && b.level === 2
  );
  const related = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);
  const updated = new Date(article.updated).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {category && (
            <>
              <Link
                href={`/category/${category.slug}`}
                className="hover:text-foreground"
              >
                {category.title}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="line-clamp-1 text-foreground">{article.title}</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,720px)_240px] lg:gap-16">
          <article className="min-w-0">
            <header>
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {article.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> Updated {updated}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {article.readTime} min read
                </span>
              </div>
            </header>

            {/* Mobile TOC */}
            <MobileTOC headings={headings} />

            <div className="mt-8">
              <ArticleRenderer blocks={article.blocks} />
            </div>

            {/* Feedback */}
            <FeedbackSection />

            {/* Contact CTA */}
            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold">Still need help?</div>
                  <div className="text-sm text-muted-foreground">
                    Reach out and we&apos;ll respond quickly.
                  </div>
                </div>
              </div>
              <a
                href="https://portal.focusv.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
              >
                Contact support <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <section className="mt-16">
                <h2 className="text-xl font-semibold tracking-tight">
                  Related articles
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/article/${r.slug}`}
                      className="group rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-accent/40 hover:bg-card"
                    >
                      <h3 className="text-sm font-semibold transition-colors group-hover:text-accent">
                        {r.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {r.summary}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {r.readTime} min
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Desktop TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              {headings.length > 0 && (
                <>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    On this page
                  </h3>
                  <ul className="mt-3 space-y-1 border-l border-border">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
