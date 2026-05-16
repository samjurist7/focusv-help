import Link from "next/link";
import { notFound } from "next/navigation";
import { Layout } from "@/components/Layout";
import { ArticleRenderer } from "@/components/article/ArticleRenderer";
import { articles, getArticle, getCategory, type Block, type HeadingBlock, type StepsBlock } from "@/lib/articles";
import { ChevronRight, Clock, CalendarDays, ArrowRight, MessageCircle } from "lucide-react";
import { MobileTOC, FeedbackSection } from "./ArticleClient";

const BASE_URL = "https://help.focusv.com";

// Generate pages for ALL articles including unpublished so old URLs don't 404
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

// Maps unpublished slugs → the consolidated article they were merged into
const REDIRECT_MAP: Record<string, { slug: string; anchor?: string }> = {
  // Legacy error code slugs → consolidated pages
  "error-code-flashing-red-white":  { slug: "carta-sport-error-codes", anchor: "red-white-flashing-overheat" },
  "error-code-flashing-red-purple": { slug: "carta-sport-error-codes", anchor: "red-purple-flashing-open-circuit" },
  "error-code-flashing-red-yellow": { slug: "carta-sport-error-codes", anchor: "red-yellow-flashing-short-circuit" },
  "red-white-flashing-lights":      { slug: "aeris-error-codes", anchor: "red-white-flashing-overheat" },
  "red-yellow-flashing-lights":     { slug: "aeris-error-codes", anchor: "red-yellow-flashing-short-circuit" },
  "red-purple-flashing-lights":     { slug: "aeris-error-codes", anchor: "red-purple-flashing-open-circuit" },
  // AERIS slug renames
  "how-to-use-your-aeris":                 { slug: "aeris-how-to-use" },
  "how-to-connect-your-aeris-to-the-app":  { slug: "aeris-connect-to-app" },
  "how-to-clean-your-aeris":               { slug: "aeris-how-to-clean" },
  "avoiding-excess-reclaim":               { slug: "aeris-avoiding-excess-reclaim" },
  "best-charging-practices":               { slug: "aeris-charging-battery" },
  "how-to-change-your-ceramic-mouthpiece": { slug: "aeris-replace-ceramic-mouthpiece" },
  "how-to-change-your-aeris-battery":      { slug: "aeris-replace-battery" },
  // CARTA Sport slug renames
  "how-to-use":                            { slug: "carta-sport-how-to-use" },
  "how-to-use-with-the-app":               { slug: "carta-sport-connect-to-app" },
  "how-to-clean":                          { slug: "carta-sport-how-to-clean" },
  "how-to-remove-install-the-connect":     { slug: "carta-sport-install-connect" },
  // SABER slug renames
  "saber-manual":                                              { slug: "saber-user-manual" },
  "how-to-use-your-saber":                                     { slug: "saber-how-to-use" },
  "using-your-saber-with-different-concentrate-consistencies": { slug: "saber-concentrate-guide" },
  "saber-troubleshooting-understanding-error-codes":           { slug: "saber-error-codes" },
  "saber-quick-start-video":                                   { slug: "saber-how-to-use" },
  // Intelli-Core Standard slug renames
  "clean-and-connect-intelli-core-atomizer":               { slug: "intellicore-how-to-install" },
  "calibrating-the-intelli-core-for-oil-atomizer":         { slug: "intellicore-oil-calibration" },
  "calibrating-your-intelli-core-for-oil-atomizer":        { slug: "intellicore-oil-calibration" },
  "using-the-intelli-core-for-herb-atomizer":              { slug: "intellicore-herb-how-to-use" },
  "intelli-core-and-everlast-for-oil-atomizer-care-guide": { slug: "intellicore-care-guide" },
  // CARTA 2 slug renames
  "how-to-use-carta-2":                                                        { slug: "carta-2-how-to-use" },
  "how-to-clean-your-carta-2-and-intelli-core-for-oil":                        { slug: "carta-2-how-to-clean" },
  "best-charging-practices-for-your-carta-2":                                  { slug: "carta-2-charging-battery" },
  "carta-2-user-tips-care-guide":                                              { slug: "carta-2-tips-care-guide" },
  "avoiding-excess-reclaim-carta-2":                                           { slug: "carta-2-tips-care-guide" },
  "carta-2-over-under-heating-troubleshooting":                                { slug: "carta-2-overunder-heating" },
  "carta-2-504-505-errors-connectivity-issues-troubleshooting":                { slug: "carta-2-504-505-errors" },
  "carta-2-reading-incorrect-atomizer-stuck-in-dry-herb-mode-troubleshooting": { slug: "carta-2-incorrect-atomizer" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article — Focus V Help" };

  const canonicalUrl = `${BASE_URL}/article/${article.slug}`;
  const title = `${article.title} — Focus V Help`;

  return {
    title,
    description: article.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: canonicalUrl,
      siteName: "Focus V Help Center",
      type: "article",
      modifiedTime: article.updated,
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.summary,
      site: "@focusvofficial",
    },
  };
}

/** Build JSON-LD for the article based on its content type */
function buildJsonLd(
  article: NonNullable<ReturnType<typeof getArticle>>,
  category: ReturnType<typeof getCategory>,
  canonicalUrl: string
) {
  const dateModified = new Date(article.updated).toISOString();
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.title,
              item: `${BASE_URL}/category/${category.slug}`,
            },
          ]
        : []),
      { "@type": "ListItem", position: category ? 3 : 2, name: article.title, item: canonicalUrl },
    ],
  };

  const stepsBlocks = article.blocks.filter(
    (b): b is StepsBlock => b.type === "steps"
  );

  // HowTo schema for articles with steps
  if (stepsBlocks.length > 0) {
    const allSteps = stepsBlocks.flatMap((b) => b.items);
    const howTo = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: article.title,
      description: article.summary,
      dateModified,
      url: canonicalUrl,
      step: allSteps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.body,
      })),
    };
    return [breadcrumb, howTo];
  }

  // Default Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    dateModified,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "Focus V",
      url: "https://focusv.com",
    },
  };

  return [breadcrumb, articleSchema];
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  // If unpublished and has a redirect destination, show redirect page
  const redirect = REDIRECT_MAP[slug];
  if (article.published === false && redirect) {
    const dest = `/article/${redirect.slug}${redirect.anchor ? `#${redirect.anchor}` : ""}`;
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <ArrowRight className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold">This article has moved</h1>
          <p className="mt-3 text-muted-foreground">
            This content has been consolidated into our comprehensive error code reference.
          </p>
          <a
            href={dest}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90"
          >
            Go to updated article <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            You will be redirected automatically.
          </p>
          <script
            dangerouslySetInnerHTML={{
              __html: `setTimeout(function(){ window.location.href = "${dest}"; }, 2000);`,
            }}
          />
        </div>
      </Layout>
    );
  }

  const category = getCategory(article.category);

  const canonicalUrl = `${BASE_URL}/article/${article.slug}`;
  const jsonLd = buildJsonLd(article, category, canonicalUrl);

  const headings = (article.blocks as Block[]).filter(
    (b): b is HeadingBlock => b.type === "heading" && b.level === 2
  );
  const hasRelatedBlock = article.blocks.some((b) => b.type === "related");
  const related = hasRelatedBlock
    ? []
    : articles
        .filter((a) => a.category === article.category && a.slug !== article.slug)
        .slice(0, 3);
  const updated = new Date(article.updated).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Layout>
      {/* JSON-LD structured data */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

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
            <FeedbackSection slug={article.slug} />

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
