import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPtils, getPtilById } from "@/lib/ptils";
import Tag from "@/components/Tag";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyButton from "@/components/CopyButton";
import SaveButton from "@/components/SaveButton";
import ExpandableSection from "@/components/ExpandableSection";

export function generateStaticParams() {
  return getAllPtils().map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const ptil = getPtilById(id);
    if (!ptil) return { title: "PTILS" };
    return {
      title: `${ptil.title} — PTILS`,
      description: ptil.whyItWorks,
    };
  });
}

export default async function PTILDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ptil = getPtilById(id);

  if (!ptil) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[720px] mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-[family-name:var(--font-jetbrains-mono)] text-muted hover:text-foreground transition-colors duration-200 mb-8"
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to all
        </Link>

        {/* Photo banner */}
        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ptil.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Number */}
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-muted mb-3">
          #{String(ptil.number).padStart(3, "0")}
        </p>

        {/* Title */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl leading-snug flex-1">
            {ptil.title}
          </h1>
          <SaveButton ptilId={ptil.id} />
        </div>

        <hr className="border-foreground/10 mb-8" />

        {/* The Prompt */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-wider text-muted">
              The Prompt
            </span>
            <CopyButton text={ptil.prompt} />
          </div>
          <div className="bg-foreground/[0.03] rounded-2xl p-5 font-[family-name:var(--font-jetbrains-mono)] font-extralight text-sm leading-relaxed text-foreground/85">
            {ptil.prompt}
          </div>
        </div>

        {/* Why It Works */}
        <div className="mb-8">
          <span className="block text-xs font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-wider text-muted mb-3">
            Why It Works
          </span>
          <p className="font-[family-name:var(--font-instrument-serif)] text-base leading-relaxed text-foreground/85">
            {ptil.whyItWorks}
          </p>
        </div>

        {/* Example Output */}
        <div className="mb-8">
          <ExpandableSection title="Example Output">
            {ptil.exampleOutput}
          </ExpandableSection>
        </div>

        <hr className="border-foreground/10 mb-6" />

        {/* Works With */}
        <p className="text-sm text-muted mb-4 font-[family-name:var(--font-jetbrains-mono)]">
          Works with: {ptil.worksWith.join(", ")}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {ptil.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
