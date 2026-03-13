export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
      {children}
    </h2>
  );
}
