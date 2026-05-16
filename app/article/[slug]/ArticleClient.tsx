"use client";

import { useState } from "react";
import { ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import type { HeadingBlock } from "@/lib/articles";

const SUPABASE_URL = "https://mcrqfavucthxfuabbmhq.supabase.co";
// Anon key — insert-only, safe to expose in client
const SUPABASE_ANON_KEY = "sb_publishable_Wt0zLAHCAVv2OX_9ZAfAAg_eZ2setWL";

async function submitFeedback(slug: string, helpful: boolean) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/help_article_feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({ slug, helpful }),
    });
  } catch {
    // Silently fail — don't interrupt the user experience
  }
}

export function MobileTOC({ headings }: { headings: HeadingBlock[] }) {
  const [tocOpen, setTocOpen] = useState(false);
  if (headings.length === 0) return null;
  return (
    <div className="mt-6 rounded-xl border border-border bg-card/40 lg:hidden">
      <button
        onClick={() => setTocOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
      >
        <span>On this page</span>
        <ChevronRight
          className={`h-4 w-4 transition-transform ${tocOpen ? "rotate-90" : ""}`}
        />
      </button>
      {tocOpen && (
        <ul className="border-t border-border px-4 py-3 text-sm">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className="block py-1.5 text-muted-foreground hover:text-accent"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FeedbackSection({ slug }: { slug: string }) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  function handleFeedback(val: "up" | "down") {
    setFeedback(val);
    submitFeedback(slug, val === "up");
  }

  return (
    <div className="mt-14 rounded-2xl border border-border bg-card/40 p-6">
      <h3 className="text-base font-semibold">Was this article helpful?</h3>
      {feedback ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {feedback === "down"
            ? "Thanks for the feedback — we'll use it to improve this article."
            : "Glad we could help! 👍"}
        </p>
      ) : (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => handleFeedback("up")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ThumbsUp className="h-4 w-4" /> Yes
          </button>
          <button
            onClick={() => handleFeedback("down")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ThumbsDown className="h-4 w-4" /> No
          </button>
        </div>
      )}
    </div>
  );
}
