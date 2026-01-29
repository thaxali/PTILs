import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full px-6 py-5 flex items-center justify-between max-w-5xl mx-auto">
      <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
        <Image 
          src="/ptils.svg" 
          alt="PTILS" 
          width={157} 
          height={46}
          className="h-10 w-auto"
          priority
        />
      </Link>
      <nav className="flex gap-6 font-[family-name:var(--font-jetbrains-mono)] text-sm text-muted">
        <Link href="/saved" className="hover:text-foreground transition-colors duration-200">
          Saved
        </Link>
        <Link href="/about" className="hover:text-foreground transition-colors duration-200">
          About
        </Link>
      </nav>
    </header>
  );
}
