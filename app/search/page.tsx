import { Suspense } from "react";
import { Layout } from "@/components/Layout";
import { SearchClient } from "./SearchClient";

export const metadata = {
  title: "Search — Focus V Help Center",
  description: "Search the Focus V help center.",
  robots: { index: false },
};

export default function SearchPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading…
            </div>
          }
        >
          <SearchClient />
        </Suspense>
      </div>
    </Layout>
  );
}
