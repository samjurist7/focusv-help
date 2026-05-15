import type { Block } from "@/lib/articles";
import { Callout } from "./Callout";
import { StepList } from "./StepList";
import { VideoEmbed } from "./VideoEmbed";
import { ImageIcon } from "lucide-react";

export function ArticleRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return b.level === 2 ? (
              <h2
                key={i}
                id={b.id}
                className="scroll-mt-24 pt-4 text-2xl font-semibold tracking-tight text-foreground"
              >
                {b.text}
              </h2>
            ) : (
              <h3
                key={i}
                id={b.id}
                className="scroll-mt-24 pt-2 text-lg font-semibold text-foreground"
              >
                {b.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={i} className="text-[15.5px] leading-7 text-foreground/85">
                {b.text}
              </p>
            );
          case "list":
            return b.ordered ? (
              <ol
                key={i}
                className="ml-5 list-decimal space-y-2 text-[15.5px] leading-7 text-foreground/85 marker:font-semibold marker:text-accent"
              >
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            ) : (
              <ul
                key={i}
                className="ml-5 list-disc space-y-2 text-[15.5px] leading-7 text-foreground/85 marker:text-accent"
              >
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <Callout key={i} type={b.variant} title={b.title}>
                {b.body}
              </Callout>
            );
          case "steps":
            return <StepList key={i} items={b.items} />;
          case "image":
            return (
              <figure key={i} className="my-6">
                <div className="flex aspect-[16/9] items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2 text-sm">
                    <ImageIcon className="h-6 w-6" />
                    <span>{b.alt}</span>
                  </div>
                </div>
                {b.caption && (
                  <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                    {b.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "code":
            return (
              <pre
                key={i}
                className="my-6 overflow-x-auto rounded-xl border border-border bg-card/60 p-4 text-sm leading-6"
              >
                {b.lang && (
                  <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    {b.lang}
                  </div>
                )}
                <code className="text-foreground/90">{b.code}</code>
              </pre>
            );
          case "video":
            return <VideoEmbed key={i} title={b.title} url={b.url} />;
        }
      })}
    </div>
  );
}
