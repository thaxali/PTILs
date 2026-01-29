import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const sections = [
  {
    title: "What is PTILS?",
    body: "PTILS stands for Prompts: Today I Learned. It's a collection of bite-sized prompt techniques that help you get more out of AI tools. Each \"petal\" is a single technique you can learn in under a minute and start using immediately.",
  },
  {
    title: "The Problem",
    body: "Most people use AI the same way every time. They type a question, get an answer, and move on. But there's a vast space of prompting techniques that can dramatically improve the quality, creativity, and usefulness of AI responses. The gap between a basic prompt and a great one is enormous — and most people don't know what they're missing.",
  },
  {
    title: "The Solution",
    body: "PTILS gives you daily bite-sized prompt techniques to expand your AI toolkit. Each technique comes with a ready-to-use prompt template, an explanation of why it works, and a real example of the output. No theory, no fluff — just practical techniques you can try right away.",
  },
  {
    title: "How It Works",
    body: "Browse through our curated collection of prompt techniques. Each one is designed to be learned in under a minute. Find one that's relevant to what you're working on, copy the prompt template, and try it with your AI tool of choice. Save the ones you want to come back to.",
  },
  {
    title: "Browse → Learn → Try → Save",
    body: "Discover new techniques by shuffling through our collection. Read the explanation to understand why each technique works. Copy the prompt and try it immediately. Save your favorites so you can build your personal prompt toolkit over time.",
  },
  {
    title: "Who Made This",
    body: "PTILS was created as a tool to help people discover the full potential of AI prompting. We believe that better prompts lead to better outcomes, and that everyone should have access to the techniques that make AI truly useful.",
  },
  {
    title: "The Seena Dot",
    body: "You might notice a small dot appear while using PTILS. That's Seena — a contextual micro-interview tool that helps us learn what you think. It asks a quick question at the right moment so we can understand how people use prompt techniques. Your feedback directly shapes the product. It's completely optional and takes just a few seconds.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[720px] mx-auto px-6 py-12">
        {sections.map((section, i) => (
          <section key={i} className="mb-20 min-h-[50vh] flex flex-col justify-center">
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl mb-6">
              {section.title}
            </h2>
            <p className="font-[family-name:var(--font-instrument-serif)] text-lg leading-relaxed text-foreground/80">
              {section.body}
            </p>
          </section>
        ))}

        <section className="mb-20 min-h-[40vh] flex flex-col justify-center items-center text-center">
          <p className="font-[family-name:var(--font-instrument-serif)] text-lg text-muted mb-6">
            Ready to discover something new?
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-primary text-white text-sm font-[family-name:var(--font-jetbrains-mono)] hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Start exploring
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
