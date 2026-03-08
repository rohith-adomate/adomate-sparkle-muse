export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">This page is under construction.</p>
    </div>
  );
}
