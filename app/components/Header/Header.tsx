"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MobileMenu } from "../MobileMenu";
import { AuthButton } from "../AuthButton";

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        mobileOpen &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [mobileOpen]);

  return (
    <header
      ref={ref}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/10 border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white tracking-wide">
          HotelFlow
        </Link>

        {/* Desktop */}

        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/Rooms">Rooms</Link>

          <Link href="/Bookings">Bookings</Link>

          <AuthButton onClick={() => setMobileOpen(false)} />
        </nav>

        {/* Mobile */}

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
};
