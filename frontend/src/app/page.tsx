"use client";

import React from 'react';
import Wizard from '@/components/Wizard';
import { Brain } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center pb-20">
      <div className="bg-glow-cyan"></div>
      <div className="bg-glow-purple"></div>

      {/* Navbar */}
      <nav className="w-full max-w-7xl px-4 sm:px-8 py-6 sm:py-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-[#b14bf4] drop-shadow-[0_0_10px_rgba(177,75,244,0.6)]" />
          <span className="text-[1.35rem] font-bold tracking-wide text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">AI SiteSpark</span>
        </div>
        <div className="hidden md:flex gap-10 text-[0.95rem] font-medium text-[#a1a3ab]">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Demos</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <button className="btn-cyan text-[0.95rem]">Get Started</button>
      </nav>

      {/* Hero Section */}
      <section className="text-center mt-10 sm:mt-16 md:mt-20 mb-10 sm:mb-16 z-10 w-full px-4">
        <h3 className="text-[#a1a3ab] font-medium tracking-wider mb-4 sm:mb-6 text-[0.95rem] sm:text-[1.1rem]">AI SiteSpark</h3>
        <h1 className="text-[2.25rem] sm:text-[3.5rem] md:text-[4.5rem] font-bold text-white tracking-tight leading-[1.15]">
          Build Your Perfect Website<br className="hidden sm:inline" />{" "}in Minutes.
        </h1>
      </section>

      {/* Wizard Section */}
      <section className="w-full max-w-6xl px-3 sm:px-6 z-10">
        <Wizard />
      </section>
    </main>
  );
}
