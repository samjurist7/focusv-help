export function StepList({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <ol className="my-6 space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-4 rounded-xl border border-border bg-card/40 p-4"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 font-mono text-sm font-semibold text-accent ring-1 ring-accent/30">
            {i + 1}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-foreground">{item.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
