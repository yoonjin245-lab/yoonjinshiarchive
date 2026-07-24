"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-0 z-40 w-full bg-white/95 px-5 py-5 sm:px-8 lg:px-10">
      <nav className="mx-auto grid max-w-[1600px] grid-cols-3 items-baseline text-sm">
        <Link href="/" className="inline-flex items-baseline gap-1 justify-self-start underline-offset-4 hover:underline">
          <span className={`inline-block h-2.5 w-2.5 border border-black ${pathname === "/" ? "bg-black" : "bg-white"}`} />
          <span>Yoonjin Shi</span>
        </Link>

        <Link href="/archive" className="inline-flex items-baseline gap-1 justify-self-center text-neutral-600 underline-offset-4 hover:text-black hover:underline">
          <span className={`inline-block h-2.5 w-2.5 border border-black ${pathname === "/archive" ? "bg-black" : "bg-white"}`} />
          <span>Archive</span>
        </Link>

        <Link href="/contact" className="inline-flex items-baseline gap-1 justify-self-end text-neutral-600 underline-offset-4 hover:text-black hover:underline">
          <span className={`inline-block h-2.5 w-2.5 border border-black ${pathname === "/contact" ? "bg-black" : "bg-white"}`} />
          <span>Contact</span>
        </Link>
      </nav>
    </header>
  );
}