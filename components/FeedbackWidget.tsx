"use client";

import React, { useRef, useState } from "react";
import { X, Send, CheckCircle, Loader2, ImagePlus, XCircle } from "lucide-react";

export default function FeedbackWidget({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 3 - screenshots.length);
    const combined = [...screenshots, ...newFiles].slice(0, 3);
    setScreenshots(combined);
    combined.forEach((f, i) => {
      if (previews[i]) return;
      const reader = new FileReader();
      reader.onload = (e) =>
        setPreviews((prev) => {
          const next = [...prev];
          next[i] = e.target?.result as string;
          return next;
        });
      reader.readAsDataURL(f);
    });
  }

  function removeScreenshot(idx: number) {
    setScreenshots((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleClose() {
    onClose();
    // Reset state after close animation
    setTimeout(() => {
      setDone(false);
      setMessage("");
      setScreenshots([]);
      setPreviews([]);
    }, 300);
  }

  async function submit() {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      let screenshotUrls: string[] = [];

      if (screenshots.length > 0) {
        const fd = new FormData();
        screenshots.forEach((f) => fd.append("files", f));
        const uploadRes = await fetch("/api/feedback/upload", {
          method: "POST",
          body: fd,
        });
        if (uploadRes.ok) {
          const { urls } = await uploadRes.json();
          screenshotUrls = urls ?? [];
        }
      }

      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          page_path:
            typeof window !== "undefined" ? window.location.pathname : "/",
          screenshot_urls: screenshotUrls,
        }),
      });

      setDone(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Submit a Ticket
            </h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 font-mono truncate">
              {typeof window !== "undefined" ? window.location.pathname : ""}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle className="h-10 w-10 text-teal-500" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Got it — thanks!
            </p>
            <p className="text-xs text-gray-400">
              We&apos;ll look into it shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Message */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the issue or request…"
              rows={5}
              autoFocus
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />

            {/* Screenshots */}
            <div className="mt-3">
              <div className="flex items-center gap-2 flex-wrap">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 flex-shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`screenshot ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeScreenshot(i)}
                      className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white"
                    >
                      <XCircle className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {screenshots.length < 3 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center justify-center gap-0.5 text-gray-400 dark:text-slate-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors flex-shrink-0"
                  >
                    <ImagePlus className="h-4 w-4" />
                    <span className="text-[9px] font-medium">Add</span>
                  </button>
                )}
                {screenshots.length > 0 && (
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">
                    {screenshots.length}/3 screenshots
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Submit */}
            <button
              onClick={submit}
              disabled={submitting || !message.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitting ? "Sending…" : "Submit"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
