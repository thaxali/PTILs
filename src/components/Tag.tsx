export default function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-[family-name:var(--font-jetbrains-mono)]">
      #{label}
    </span>
  );
}
