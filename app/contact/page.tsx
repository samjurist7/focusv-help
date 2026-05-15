import { Layout } from "@/components/Layout";
import { Mail, MessageCircle, ExternalLink, BookOpen } from "lucide-react";

export const metadata = {
  title: "Contact Support — Focus V Help Center",
  description: "Reach the Focus V support team by portal or email.",
  openGraph: {
    title: "Contact Focus V Support",
    description: "Reach the Focus V support team by portal or email.",
  },
};

export default function ContactPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="text-center">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Contact support
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground">
            Pick the channel that works best for you. Most replies go out within
            a few hours during business days.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="https://portal.focusv.com"
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-border bg-card/40 p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
              <MessageCircle className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Support portal</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Open a ticket, track status, and chat with our support team.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
              portal.focusv.com <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
          <a
            href="mailto:support@focusv.com"
            className="group rounded-2xl border border-border bg-card/40 p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
              <Mail className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Email us</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Prefer email? Send us your serial number and a description of the
              issue.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
              support@focusv.com
            </span>
          </a>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card/40 p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold">Try the help center first</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Most issues are answered in seconds by our guides — searching
                there is the fastest path to a fix.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
