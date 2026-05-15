"use client";

import { Play } from "lucide-react";
import { useState } from "react";

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be"))
      return u.pathname.slice(1).split("/")[0] || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/shorts/"))
        return u.pathname.split("/")[2] || null;
      if (u.pathname.startsWith("/embed/"))
        return u.pathname.split("/")[2] || null;
      if (u.pathname === "/watch") return u.searchParams.get("v");
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoEmbed({
  title = "Video walkthrough",
  url,
}: {
  title?: string;
  url?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = url ? extractYouTubeId(url) : null;

  if (id) {
    const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    return (
      <div className="my-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="relative aspect-video">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 block"
              aria-label={`Play ${title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb}
                alt={title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20 transition-opacity group-hover:from-black/60" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl ring-4 ring-background/30 transition-transform group-hover:scale-110">
                  <Play className="h-7 w-7 translate-x-0.5 fill-current" />
                </span>
              </span>
              <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="line-clamp-1 rounded-md bg-black/60 px-2 py-1 text-white backdrop-blur">
                  {title}
                </span>
                <span className="rounded-md bg-black/60 px-2 py-1 text-white/80 backdrop-blur">
                  YouTube
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-muted">
      <div className="relative aspect-video">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklab,var(--accent)_25%,transparent),transparent_60%)]" />
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="group absolute inset-0 grid place-items-center"
            aria-label={`Watch ${title}`}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-7 w-7 translate-x-0.5 fill-current" />
            </span>
          </a>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
              <Play className="h-7 w-7 translate-x-0.5 fill-current" />
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="rounded-md bg-background/70 px-2 py-1 backdrop-blur">
            {title}
          </span>
          <span className="rounded-md bg-background/70 px-2 py-1 backdrop-blur">
            Video
          </span>
        </div>
      </div>
    </div>
  );
}
