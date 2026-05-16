"use client";

import React, { useRef, useState } from "react";
import {
  Wrench,
  Smartphone,
  Package,
  RotateCcw,
  HelpCircle,
  CheckCircle,
  Loader2,
  ImagePlus,
  XCircle,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasDevice: boolean;
};

type Device = { id: string; label: string };

type IssueSet = { id: string; label: string };

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { id: "Device / Warranty", label: "Device / Warranty", icon: <Wrench className="h-5 w-5" />, hasDevice: true },
  { id: "App Issue", label: "App Issue", icon: <Smartphone className="h-5 w-5" />, hasDevice: true },
  { id: "Order & Shipping", label: "Order & Shipping", icon: <Package className="h-5 w-5" />, hasDevice: false },
  { id: "Returns & Refunds", label: "Returns & Refunds", icon: <RotateCcw className="h-5 w-5" />, hasDevice: false },
  { id: "General Question", label: "General Question", icon: <HelpCircle className="h-5 w-5" />, hasDevice: false },
];

const DEVICES: Device[] = [
  { id: "CARTA 2", label: "CARTA 2" },
  { id: "CARTA SPORT", label: "CARTA SPORT" },
  { id: "AERIS", label: "AERIS" },
  { id: "SABER", label: "SABER" },
  { id: "INTELLI-CORE Atomizer", label: "INTELLI-CORE Atomizer" },
  { id: "Other / Accessory", label: "Other / Accessory" },
];

const DEVICE_ISSUES: IssueSet[] = [
  { id: "Not heating", label: "Not heating" },
  { id: "Won't turn on", label: "Won't turn on" },
  { id: "Battery / charging", label: "Battery / charging" },
  { id: "Atomizer not detected", label: "Atomizer not detected" },
  { id: "App / Bluetooth", label: "App / Bluetooth" },
  { id: "Broken / cracked", label: "Broken / cracked" },
  { id: "Leaking", label: "Leaking" },
  { id: "LED / display", label: "LED / display" },
  { id: "Other", label: "Other" },
];

const APP_ISSUES: IssueSet[] = [
  { id: "Can't connect to device", label: "Can't connect to device" },
  { id: "Won't open / crashes", label: "Won't open / crashes" },
  { id: "Settings not saving", label: "Settings not saving" },
  { id: "Firmware update", label: "Firmware update" },
  { id: "Login / account", label: "Login / account" },
  { id: "iOS", label: "iOS" },
  { id: "Android", label: "Android" },
  { id: "Other", label: "Other" },
];

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Step {current} of {total}
        </span>
        <span className="text-xs text-muted-foreground">
          {Math.round(((current - 1) / total) * 100)}% complete
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border">
        <div
          className="h-1.5 rounded-full bg-accent transition-all duration-500"
          style={{ width: `${((current - 1) / total) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex gap-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i + 1 < current
                ? "bg-accent"
                : i + 1 === current
                ? "bg-accent/50"
                : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContactForm() {
  // Form state
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<string>("");
  const [device, setDevice] = useState<string>("");
  const [issueTypes, setIssueTypes] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCategory = CATEGORIES.find((c) => c.id === category);
  const needsDeviceStep = selectedCategory?.hasDevice ?? false;
  const totalSteps = needsDeviceStep ? 4 : 3;
  // Actual step numbers — step 1 = category, step 2 = device (if needed), step 3 = describe, step 4 = contact
  // We map "visual step" to "logical step":
  //   visual 1 → category
  //   visual 2 → device (if needsDeviceStep) OR describe (if not)
  //   visual 3 → describe (if needsDeviceStep) OR contact (if not)
  //   visual 4 → contact (if needsDeviceStep)
  function getLogicalStep(visual: number): "category" | "device" | "describe" | "contact" {
    if (visual === 1) return "category";
    if (needsDeviceStep) {
      if (visual === 2) return "device";
      if (visual === 3) return "describe";
      return "contact";
    } else {
      if (visual === 2) return "describe";
      return "contact";
    }
  }

  const logicalStep = getLogicalStep(step);
  const issueOptions = category === "App Issue" ? APP_ISSUES : DEVICE_ISSUES;

  // ── Photo handling ──────────────────────────────────────────────────────────

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 3 - screenshots.length);
    const combined = [...screenshots, ...newFiles].slice(0, 3);
    setScreenshots(combined);
    // Read new previews
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

  function toggleIssue(id: string) {
    setIssueTypes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    if (logicalStep === "category" && !category) {
      newErrors.category = "Please select a category.";
    }
    if (logicalStep === "device" && !device) {
      newErrors.device = "Please select your device.";
    }
    if (logicalStep === "describe" && !message.trim()) {
      newErrors.message = "Please describe your issue.";
    }
    if (logicalStep === "contact") {
      if (!firstName.trim()) newErrors.firstName = "Required.";
      if (!lastName.trim()) newErrors.lastName = "Required.";
      if (!email.trim()) newErrors.email = "Required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email.";
      if (!phone.trim()) newErrors.phone = "Required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, totalSteps));
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function submit() {
    if (!validateStep()) return;
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

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_first_name: firstName.trim(),
          customer_last_name: lastName.trim(),
          customer_email: email.trim(),
          customer_phone: phone.trim(),
          device_type: device || undefined,
          issue_category: category,
          issue_types: issueTypes.length > 0 ? issueTypes : undefined,
          order_number: orderNumber.trim() || undefined,
          message: message.trim(),
          screenshot_urls: screenshotUrls,
          page_path: "/contact",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to submit");
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors({ submit: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Success state ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card/40 p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle className="h-9 w-9 text-accent" />
          </div>
          <h1 className="text-2xl font-semibold">Request submitted!</h1>
          <p className="mt-3 text-muted-foreground">
            We&apos;ll get back to you within 1–2 business days.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Need urgent help?{" "}
            <a
              href="mailto:support@focusv.com"
              className="text-accent hover:underline"
            >
              support@focusv.com
            </a>
          </p>
          <a
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-medium hover:border-accent/40 transition-colors"
          >
            Back to Help Center
          </a>
        </div>
      </div>
    );
  }

  // ─── Form layout ─────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Contact Support
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tell us what&apos;s going on and we&apos;ll get back to you quickly.
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} total={totalSteps} />

      {/* Step content */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8">

        {/* ── Step 1: Category ── */}
        {logicalStep === "category" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">What do you need help with?</h2>
            <p className="text-sm text-muted-foreground mb-5">Select the category that best fits your issue.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setCategory(cat.id); setErrors({}); }}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all hover:-translate-y-0.5 ${
                    category === cat.id
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-card/20 hover:border-accent/40"
                  }`}
                >
                  <span className={`shrink-0 ${category === cat.id ? "text-accent" : "text-muted-foreground"}`}>
                    {cat.icon}
                  </span>
                  <span className="font-medium text-sm">{cat.label}</span>
                  {category === cat.id && (
                    <CheckCircle className="ml-auto h-4 w-4 text-accent shrink-0" />
                  )}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-3 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
        )}

        {/* ── Step 2: Device (only when category requires it) ── */}
        {logicalStep === "device" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Which device?</h2>
            <p className="text-sm text-muted-foreground mb-5">Select your Focus V device.</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {DEVICES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => { setDevice(d.id); setErrors({}); }}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    device === d.id
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border hover:border-accent/40"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {errors.device && (
              <p className="mb-4 text-sm text-red-500">{errors.device}</p>
            )}

            {/* Issue type checkboxes */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                What&apos;s the issue? (optional — select all that apply)
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {issueOptions.map((issue) => (
                  <label
                    key={issue.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                      issueTypes.includes(issue.id)
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={issueTypes.includes(issue.id)}
                      onChange={() => toggleIssue(issue.id)}
                      className="h-4 w-4 accent-[var(--accent)] rounded"
                    />
                    <span className="text-sm">{issue.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step: Describe ── */}
        {logicalStep === "describe" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Tell us more</h2>
            <p className="text-sm text-muted-foreground mb-5">Describe your issue in as much detail as you can.</p>

            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); setErrors((prev) => ({ ...prev, message: "" })); }}
              placeholder="Describe what's happening, what you've tried, and any error messages…"
              rows={6}
              className={`w-full resize-none rounded-xl border bg-card/20 px-4 py-3 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                errors.message ? "border-red-500" : "border-border"
              }`}
            />
            {errors.message && (
              <p className="mt-1.5 text-sm text-red-500">{errors.message}</p>
            )}

            {/* Photo upload */}
            <div className="mt-5">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Add photos (optional — up to 3)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative h-20 w-20 overflow-hidden rounded-lg border border-border flex-shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`screenshot ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(i)}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {screenshots.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Add</span>
                  </button>
                )}
                {screenshots.length > 0 && (
                  <span className="text-xs text-muted-foreground">{screenshots.length}/3</span>
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
          </div>
        )}

        {/* ── Step: Contact info ── */}
        {logicalStep === "contact" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Your contact info</h2>
            <p className="text-sm text-muted-foreground mb-5">We&apos;ll use this to follow up with you directly.</p>

            {/* Summary card */}
            <div className="mb-6 rounded-xl border border-border bg-card/20 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Ticket Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-20 shrink-0">Category:</span>
                  <span className="font-medium">{category}</span>
                </div>
                {device && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-20 shrink-0">Device:</span>
                    <span className="font-medium">{device}</span>
                  </div>
                )}
                {issueTypes.length > 0 && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-20 shrink-0">Issues:</span>
                    <span className="font-medium">{issueTypes.join(", ")}</span>
                  </div>
                )}
                {message && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-20 shrink-0">Message:</span>
                    <span className="line-clamp-2 text-muted-foreground">{message}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors((prev) => ({ ...prev, firstName: "" })); }}
                  placeholder="Jane"
                  className={`w-full rounded-xl border bg-card/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${errors.firstName ? "border-red-500" : "border-border"}`}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrors((prev) => ({ ...prev, lastName: "" })); }}
                  placeholder="Smith"
                  className={`w-full rounded-xl border bg-card/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${errors.lastName ? "border-red-500" : "border-border"}`}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: "" })); }}
                  placeholder="jane@example.com"
                  className={`w-full rounded-xl border bg-card/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${errors.email ? "border-red-500" : "border-border"}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: "" })); }}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full rounded-xl border bg-card/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${errors.phone ? "border-red-500" : "border-border"}`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Order Number <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="FV-12345"
                  className="w-full rounded-xl border border-border bg-card/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                />
              </div>
            </div>

            {errors.submit && (
              <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {errors.submit}
              </p>
            )}
          </div>
        )}

        {/* ── Navigation buttons ── */}
        <div className={`mt-8 flex items-center ${step > 1 ? "justify-between" : "justify-end"}`}>
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:border-accent/40 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}

          {logicalStep !== "contact" ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:opacity-90"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit ticket
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
