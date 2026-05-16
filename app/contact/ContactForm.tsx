"use client";

import React, { useRef, useState } from "react";
import { CheckCircle, ChevronLeft, Loader2, X, Upload } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const FV_COLORWAYS: Record<string, string[]> = {
  "CARTA 2": ["Black", "Bordeaux", "Clear", "Forest", "Grape", "Midnight", "Mint"],
  "CARTA SPORT": ["Black", "Lilac", "Tangerine", "Teal"],
  "AERIS": ["Black", "Bubblegum", "Clear", "Grape", "Jade", "Midnight"],
  "SABER": ["Black", "Bordeaux", "Bubblegum", "Clear", "Forest", "Grape", "Jade", "Lilac", "Midnight", "Mint", "Tangerine", "Teal"],
  "INTELLICORE": ["Standard", "MAX", "Dry Herb"],
  "OTHER": ["Smoke", "Clear", "Orange", "Green", "Purple", "Blue", "Red"],
};

const FV_COLORWAY_LABEL: Record<string, string> = {
  "INTELLICORE": "INTELLICORE Type",
  "OTHER": "Glass Top Color",
};

const FV_SERIALS: Record<string, { id: string; label: string }[]> = {
  "AERIS": [
    { id: "fv_sb", label: "Base Unit Serial #" },
    { id: "fv_sbat", label: "Battery Serial #" },
    { id: "fv_sa", label: "Atomizer Serial #" },
  ],
  "CARTA 2": [
    { id: "fv_sb", label: "Base Unit Serial #" },
    { id: "fv_sa", label: "Atomizer Serial #" },
  ],
  "CARTA SPORT": [
    { id: "fv_sb", label: "Base Unit Serial #" },
    { id: "fv_sa", label: "Atomizer Serial #" },
  ],
  "SABER": [{ id: "fv_sb", label: "Serial #" }],
  "INTELLICORE": [{ id: "fv_sa", label: "Atomizer Serial #" }],
  "OTHER": [{ id: "fv_ss", label: "Serial #" }],
};

// Category options
const CATEGORIES = [
  { id: "device", label: "Device / Warranty", emoji: "🔧" },
  { id: "app", label: "App Issue", emoji: "📱" },
  { id: "order", label: "Order & Shipping", emoji: "📦" },
  { id: "returns", label: "Return / Refund", emoji: "↩️" },
  { id: "other", label: "General Inquiry", emoji: "💬" },
];

// Device options — keys must match FV_COLORWAYS / FV_SERIALS
const DEVICES = [
  { id: "CARTA 2", label: "CARTA 2" },
  { id: "CARTA SPORT", label: "CARTA SPORT" },
  { id: "AERIS", label: "AERIS" },
  { id: "SABER", label: "SABER" },
  { id: "INTELLICORE", label: "INTELLICORE Atomizer" },
  { id: "OTHER", label: "Other / Accessory" },
];

const DEVICE_ISSUES = [
  "Not heating",
  "Won't turn on",
  "Battery / charging",
  "Atomizer not detected",
  "App / Bluetooth",
  "Broken / cracked",
  "Leaking",
  "LED / display",
  "Other",
];

const APP_ISSUES = [
  "Can't connect to device",
  "Won't open / crashes",
  "Settings not saving",
  "Firmware update",
  "Login / account",
  "iOS",
  "Android",
  "Other",
];

const CATS_LABEL: Record<string, string> = {
  device: "Device/Warranty",
  app: "App Issue",
  order: "Order & Shipping",
  returns: "Return/Refund",
  other: "General Inquiry",
};

// ─── Step type ────────────────────────────────────────────────────────────────

type Step = "step1" | "step2-device" | "step2-issue" | "step2-app" | "step3" | "step4" | "step5";

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: Step }) {
  const segment =
    step === "step1"
      ? 1
      : step === "step2-device" || step === "step2-issue" || step === "step2-app"
      ? 2
      : step === "step3"
      ? 3
      : step === "step4" || step === "step5"
      ? 4
      : 1;

  return (
    <div className="mb-8 flex gap-2">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            n <= segment ? "bg-accent" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContactForm() {
  const [step, setStep] = useState<Step>("step1");
  const [state, setState] = useState({
    category: "" as string,
    device: "" as string,
    issues: [] as string[],
    appIssues: [] as string[],
    description: "",
    serials: {} as Record<string, string>,
    colorway: "",
    purchaseDate: "",
    purchaseFrom: "",
    registered: "",
    files: [] as File[],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    orderNumber: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function set<K extends keyof typeof state>(key: K, value: (typeof state)[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function toggleIssue(issue: string, field: "issues" | "appIssues") {
    setState((prev) => ({
      ...prev,
      [field]: prev[field].includes(issue)
        ? prev[field].filter((x: string) => x !== issue)
        : [...prev[field], issue],
    }));
  }

  function setSerial(id: string, value: string) {
    setState((prev) => ({ ...prev, serials: { ...prev.serials, [id]: value } }));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files);
    setState((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles].slice(0, 5),
    }));
  }

  function removeFile(idx: number) {
    setState((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }));
  }

  // ── Category select (step1 → next) ────────────────────────────────────────

  function selectCategory(id: string) {
    setState((prev) => ({
      ...prev,
      category: id,
      device: "",
      issues: [],
      appIssues: [],
      serials: {},
      colorway: "",
      purchaseDate: "",
      purchaseFrom: "",
      registered: "",
    }));
    if (id === "device") setStep("step2-device");
    else if (id === "app") setStep("step2-app");
    else setStep("step3");
  }

  // ── Device select (step2-device → step2-issue) ────────────────────────────

  function selectDevice(id: string) {
    setState((prev) => ({ ...prev, device: id, serials: {}, colorway: "" }));
    setStep("step2-issue");
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function fvSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      // 1. Upload files
      const uploaded: { name: string; url: string }[] = [];
      for (const file of state.files) {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("https://teamsho.app/api/cs/upload-public", {
          method: "POST",
          body: fd,
        });
        if (r.ok) {
          const d = await r.json();
          if (d.url) uploaded.push({ name: file.name, url: d.url });
        }
      }

      // 2. Build subject + body
      const allIssues = [...state.issues, ...state.appIssues];
      const subject = state.device
        ? `${CATS_LABEL[state.category]} — ${state.device}${allIssues.length ? ": " + allIssues[0] : ""}`
        : `${CATS_LABEL[state.category]} — ${state.firstName} ${state.lastName}`;

      let body = state.description + "\n\n";
      if (state.device) body += `Device: ${state.device}\n`;
      if (allIssues.length) body += `Issues: ${allIssues.join(", ")}\n`;

      Object.entries(state.serials).forEach(([k, v]) => {
        if (!v) return;
        if (k === "fv_sb") body += `Base Serial #: ${v}\n`;
        else if (k === "fv_sbat") body += `Battery Serial #: ${v}\n`;
        else if (k === "fv_sa") body += `Atomizer Serial #: ${v}\n`;
        else body += `Serial #: ${v}\n`;
      });

      if (state.purchaseDate) body += `Purchase Date: ${state.purchaseDate}\n`;
      if (state.colorway) body += `Colorway: ${state.colorway}\n`;
      if (state.purchaseFrom) body += `Purchased From: ${state.purchaseFrom}\n`;
      if (state.registered) body += `Registered: ${state.registered}\n`;
      if (state.orderNumber) body += `Order #: ${state.orderNumber}\n`;
      if (state.phone) body += `Phone: ${state.phone}\n`;

      // 3. POST to teamsho
      const res = await fetch("https://teamsho.app/api/cs/tickets/create-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: state.email,
          toName: `${state.firstName} ${state.lastName}`,
          subject,
          body,
          attachments: uploaded,
          category: state.category,
          device: state.device,
          issues: allIssues,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Submission failed");

      setTicketId(data.ticketId ?? null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success ────────────────────────────────────────────────────────────────

  if (ticketId !== null) {
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
          {ticketId && (
            <p className="mt-2 text-sm font-medium text-accent">Ticket #{ticketId}</p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Need urgent help?{" "}
            <a href="mailto:support@focusv.com" className="text-accent hover:underline">
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

  // ─── Shared styles ────────────────────────────────────────────────────────

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40";
  const selectCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40";
  const primaryBtn =
    "w-full rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60";
  const backBtn =
    "text-sm text-muted-foreground hover:text-foreground flex items-center gap-1";
  const chipSelected = "border-accent bg-accent/10 text-accent";
  const chipBase =
    "rounded-xl border border-border bg-card/40 p-4 cursor-pointer transition-all hover:border-accent/40";

  // ─── Form layout ──────────────────────────────────────────────────────────

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

      {/* Progress bar */}
      <ProgressBar step={step} />

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8">

        {/* ── step1: Category ─────────────────────────────────────────────── */}
        {step === "step1" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">What do you need help with?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Select the category that best fits your issue.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => selectCategory(cat.id)}
                  className={`${chipBase} flex items-center gap-3 text-left ${
                    state.category === cat.id ? chipSelected : ""
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="font-medium text-sm">{cat.label}</span>
                  {state.category === cat.id && (
                    <CheckCircle className="ml-auto h-4 w-4 text-accent shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── step2-device: Device select ──────────────────────────────────── */}
        {step === "step2-device" && (
          <div>
            <button type="button" onClick={() => setStep("step1")} className={`${backBtn} mb-5`}>
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <h2 className="text-lg font-semibold mb-1">Which device?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Select your Focus V device.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {DEVICES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => selectDevice(d.id)}
                  className={`${chipBase} text-sm font-medium text-center py-3 ${
                    state.device === d.id ? chipSelected : ""
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── step2-issue: Issue chips ─────────────────────────────────────── */}
        {step === "step2-issue" && (
          <div>
            <button type="button" onClick={() => setStep("step2-device")} className={`${backBtn} mb-5`}>
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <h2 className="text-lg font-semibold mb-1">What&apos;s the issue?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Select all that apply — this helps us route your ticket faster.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DEVICE_ISSUES.map((issue) => (
                <button
                  key={issue}
                  type="button"
                  onClick={() => toggleIssue(issue, "issues")}
                  className={`${chipBase} text-sm text-left flex items-center gap-2 ${
                    state.issues.includes(issue) ? chipSelected : ""
                  }`}
                >
                  {state.issues.includes(issue) && (
                    <CheckCircle className="h-4 w-4 shrink-0 text-accent" />
                  )}
                  <span>{issue}</span>
                </button>
              ))}
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setStep("step3")}
                className={primaryBtn}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── step2-app: App issue chips ───────────────────────────────────── */}
        {step === "step2-app" && (
          <div>
            <button type="button" onClick={() => setStep("step1")} className={`${backBtn} mb-5`}>
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <h2 className="text-lg font-semibold mb-1">What&apos;s the app issue?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Select all that apply.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {APP_ISSUES.map((issue) => (
                <button
                  key={issue}
                  type="button"
                  onClick={() => toggleIssue(issue, "appIssues")}
                  className={`${chipBase} text-sm text-left flex items-center gap-2 ${
                    state.appIssues.includes(issue) ? chipSelected : ""
                  }`}
                >
                  {state.appIssues.includes(issue) && (
                    <CheckCircle className="h-4 w-4 shrink-0 text-accent" />
                  )}
                  <span>{issue}</span>
                </button>
              ))}
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setStep("step3")}
                className={primaryBtn}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── step3: Description + device fields + file uploads ────────────── */}
        {step === "step3" && (
          <div>
            <button
              type="button"
              onClick={() => {
                if (state.category === "device") setStep("step2-issue");
                else if (state.category === "app") setStep("step2-app");
                else setStep("step1");
              }}
              className={`${backBtn} mb-5`}
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <h2 className="text-lg font-semibold mb-1">Tell us more</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Describe your issue in as much detail as you can.
            </p>

            {/* Description */}
            <textarea
              value={state.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe what's happening, what you've tried, and any error messages…"
              rows={5}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
            />

            {/* Device fields — only when category=device AND device is set */}
            {state.category === "device" && state.device && (
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Device Details
                </h3>

                {/* Serial number inputs */}
                {(FV_SERIALS[state.device] ?? []).map(({ id, label }) => (
                  <div key={id}>
                    <label className="mb-1.5 block text-sm font-medium">{label}</label>
                    <input
                      type="text"
                      value={state.serials[id] ?? ""}
                      onChange={(e) => setSerial(id, e.target.value)}
                      placeholder={label}
                      className={inputCls}
                    />
                  </div>
                ))}

                {/* Purchase Date */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Purchase Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={state.purchaseDate}
                    onChange={(e) => set("purchaseDate", e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>

                {/* Colorway / type */}
                {FV_COLORWAYS[state.device] && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      {FV_COLORWAY_LABEL[state.device] ?? "Colorway"}{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={state.colorway}
                      onChange={(e) => set("colorway", e.target.value)}
                      required
                      className={selectCls}
                    >
                      <option value="">Select…</option>
                      {FV_COLORWAYS[state.device].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Where purchased */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Where purchased <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={state.purchaseFrom}
                    onChange={(e) => set("purchaseFrom", e.target.value)}
                    required
                    className={selectCls}
                  >
                    <option value="">Select…</option>
                    <option value="FocusV.com">FocusV.com</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Retail store">Retail store</option>
                    <option value="Other online retailer">Other online retailer</option>
                  </select>
                </div>

                {/* Is device registered */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Is device registered? <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={state.registered}
                    onChange={(e) => set("registered", e.target.value)}
                    required
                    className={selectCls}
                  >
                    <option value="">Select…</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Not sure">Not sure</option>
                  </select>
                </div>
              </div>
            )}

            {/* File upload */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Attachments (optional)
              </h3>

              {/* Drop zone */}
              <div
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6" />
                <p className="text-sm font-medium">Click to add files</p>
                <p className="text-xs">Photos, videos, or documents</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {/* File chips */}
              {state.files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {state.files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs"
                    >
                      <span className="max-w-[120px] truncate">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setStep("step4")}
                className={primaryBtn}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── step4: Contact info ──────────────────────────────────────────── */}
        {step === "step4" && (
          <div>
            <button type="button" onClick={() => setStep("step3")} className={`${backBtn} mb-5`}>
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <h2 className="text-lg font-semibold mb-1">Your contact info</h2>
            <p className="text-sm text-muted-foreground mb-5">
              We&apos;ll use this to follow up with you directly.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={state.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="Jane"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={state.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  placeholder="Smith"
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="jane@example.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Phone{" "}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={state.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Order Number{" "}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={state.orderNumber}
                  onChange={(e) => set("orderNumber", e.target.value)}
                  placeholder="FV-12345"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setStep("step5")}
                disabled={!state.firstName || !state.lastName || !state.email}
                className={primaryBtn}
              >
                Review &amp; Submit
              </button>
            </div>
          </div>
        )}

        {/* ── step5: Summary + submit ──────────────────────────────────────── */}
        {step === "step5" && (
          <div>
            <button type="button" onClick={() => setStep("step4")} className={`${backBtn} mb-5`}>
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <h2 className="text-lg font-semibold mb-1">Review your request</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Everything look good? Hit Submit to send your ticket.
            </p>

            {/* Summary card */}
            <div className="rounded-xl border border-border bg-card/40 p-5 space-y-2 text-sm mb-6">
              {[
                ["Category", CATS_LABEL[state.category] ?? state.category],
                state.device ? ["Device", state.device] : null,
                state.issues.length ? ["Issues", state.issues.join(", ")] : null,
                state.appIssues.length ? ["App Issues", state.appIssues.join(", ")] : null,
                state.description ? ["Description", state.description] : null,
                state.colorway ? ["Colorway", state.colorway] : null,
                state.purchaseDate ? ["Purchase Date", state.purchaseDate] : null,
                state.purchaseFrom ? ["Purchased From", state.purchaseFrom] : null,
                state.registered ? ["Registered", state.registered] : null,
                state.orderNumber ? ["Order #", state.orderNumber] : null,
                [`${state.firstName} ${state.lastName}`, state.email],
                state.phone ? ["Phone", state.phone] : null,
                state.files.length ? ["Attachments", `${state.files.length} file(s)`] : null,
              ]
                .filter(Boolean)
                .map((row, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-32 shrink-0 text-muted-foreground">{(row as string[])[0]}</span>
                    <span className="font-medium break-all">{(row as string[])[1]}</span>
                  </div>
                ))}
            </div>

            {submitError && (
              <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </p>
            )}

            <button
              type="button"
              onClick={fvSubmit}
              disabled={submitting}
              className={primaryBtn}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </span>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
