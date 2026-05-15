"use client";

import React from 'react';
import Link from 'next/link';
import Wizard from '@/components/Wizard';

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center pb-20" style={{ background: '#ffffff' }}>
      <div className="bg-glow-cyan"></div>
      <div className="bg-glow-purple"></div>

      {/* Navbar */}
      <nav className="w-full max-w-7xl px-4 sm:px-8 py-6 sm:py-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <img src="/brandmark.png" alt="AI SiteSpark" className="w-9 h-9 rounded-lg" />
          <span className="text-[1.35rem] font-bold tracking-wide" style={{ color: '#0F172A' }}>AI SiteSpark</span>
        </div>
        <div className="hidden md:flex gap-10 text-[0.95rem] font-medium" style={{ color: '#64748B' }}>
          <Link href="/features" className="hover:text-[#00A38D] transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-[#00A38D] transition-colors">Pricing</Link>
          <Link href="/demos" className="hover:text-[#00A38D] transition-colors">Demos</Link>
          <Link href="/contact" className="hover:text-[#00A38D] transition-colors">Contact</Link>
        </div>
        <Link href="/contact"><button className="btn-cyan text-[0.95rem]">Get Started</button></Link>
      </nav>

      {/* Hero Section */}
      <section className="text-center mt-10 sm:mt-16 md:mt-20 mb-10 sm:mb-16 z-10 w-full px-4">
        <h1 className="text-[2.25rem] sm:text-[3.5rem] md:text-[4.5rem] font-bold tracking-tight leading-[1.15]" style={{ color: '#0F172A' }}>
          See Your Business Online<br className="hidden sm:inline" />{" "}in 60 Seconds
        </h1>
      </section>

      {/* Wizard Section */}
      <section className="w-full max-w-6xl px-3 sm:px-6 z-10">
        <Wizard />
      </section>
    </main>
  );
}
