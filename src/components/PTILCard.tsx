import Link from "next/link";
import Tag from "./Tag";
import type { PTIL } from "@/lib/ptils";

interface PTILCardProps {
  ptil: PTIL;
  compact?: boolean;
}

export default function PTILCard({ ptil, compact = false }: PTILCardProps) {
  return (
    <Link href={`/til/${ptil.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        {!compact && (
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ptil.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-5">
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-muted mb-2">
            #{String(ptil.number).padStart(3, "0")}
          </p>
          <h3 className="font-[family-name:var(--font-instrument-serif)] text-lg leading-snug mb-3">
            {ptil.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {ptil.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
