"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="w-full px-6 py-5 flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto gap-4 sm:gap-0">
      <div className="w-full sm:w-auto flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
          <Image
            src="/ptils-m.svg"
            alt="PTILS"
            width={157}
            height={46}
            className="h-10 w-auto sm:hidden"
            priority
            unoptimized
          />
          <Image
            src="/ptils.svg"
            alt="PTILS"
            width={157}
            height={46}
            className="h-10 w-auto hidden sm:block"
            priority
            unoptimized
          />
        </Link>
        <div className="relative sm:hidden overflow-visible" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 -mr-2 hover:opacity-80 transition-opacity duration-200"
            aria-label="Menu"
          >
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted"
            >
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                </>
              )}
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-foreground/10 rounded-lg shadow-lg py-2 z-50">
              <Link
                href="/saved"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-sm text-muted hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
              >
                Saved
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-sm text-muted hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
              >
                About
              </Link>
            </div>
          )}
        </div>
      </div>
      <p className="font-[family-name:var(--font-instrument-serif)] text-3xl text-foreground text-center whitespace-nowrap">
        Discover New AI Prompts
      </p>
      <nav className="hidden sm:flex gap-6 font-[family-name:var(--font-jetbrains-mono)] text-sm text-muted">
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
