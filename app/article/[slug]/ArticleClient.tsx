"use client";

import { useState } from "react";
import { ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import type { HeadingBlock } from "@/lib/articles";

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

export function FeedbackSection() {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  return (
    <div className="mt-14 rounded-2xl border border-border bg-card/40 p-6">
      <h3 className="text-base font-semibold">Was this article helpful?</h3>
      {feedback ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for the feedback.{" "}
          {feedback === "down"
            ? "We'll use it to improve this article."
            : "Glad we could help."}
        </p>
      ) : (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setFeedback("up")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ThumbsUp className="h-4 w-4" /> Yes
          </button>
          <button
            onClick={() => setFeedback("down")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ThumbsDown className="h-4 w-4" /> No
          </button>
        </div>
      )}
    </div>
  );
}
