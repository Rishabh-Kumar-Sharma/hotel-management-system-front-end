"use client";
import { useState } from "react";
import Link from "next/link";

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white">
        <Link href="/" className="text-xl font-bold tracking-wide">
          HotelFlow
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/Bookings" className="hover:text-indigo-300 transition">
            Bookings
          </Link>
          <Link href="/Rooms" className="hover:text-indigo-300 transition">
            Rooms
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition"
          >
            Dashboard
          </Link>
          <Link
            href="/Login"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-xl transition"
          >
            Login / Signup
          </Link>
        </nav>

        {/* Mobile Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 text-white bg-black/40 backdrop-blur-xl">
          <Link href="#features" onClick={() => setOpen(false)}>
            Features
          </Link>
          <Link href="#about" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="bg-indigo-600 px-4 py-2 rounded-lg text-center"
          >
            Dashboard
          </Link>
        </div>
      )}
    </header>
  );
};
