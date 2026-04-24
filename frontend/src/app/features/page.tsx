"use client";
import React from 'react';
import Link from 'next/link';
import { Brain, Zap, Cpu, Palette, Globe, GitBranch, BarChart3, Smartphone, ArrowRight } from 'lucide-react';

const CYAN = '#00f0ff';

const features = [
  {
    icon: Cpu,
    title: 'AI-Powered Generation',
    desc: 'Our engine reads your business name, industry, and personality to generate a fully structured, content-rich website in under 60 seconds.',
  },
  {
    icon: Palette,
    title: 'Curated Color Palettes',
    desc: 'Choose from 12 professionally curated multi-color palettes. Every palette injects 4 harmonious colors across your entire website automatically.',
  },
  {
    icon: Globe,
    title: 'Live GitHub Pages Deploy',
    desc: 'Every demo is instantly deployed to GitHub Pages with a real shareable URL — no localhost, no manual setup needed.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Templates',
    desc: 'All 15+ industry templates are built mobile-first with responsive CSS breakpoints — they look stunning on every screen size.',
  },
  {
    icon: GitBranch,
    title: '15+ Industry Templates',
    desc: 'From Restaurants to Real Estate, Education to E-Commerce — we cover every major Indian industry vertical with a bespoke template.',
  },
  {
    icon: BarChart3,
    title: 'Conversion-Optimised CTAs',
    desc: 'Every generated site includes a floating "Claim It Now" bar that directs potential clients to your professional pricing page.',
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#07080a', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #1f222e', position: 'sticky', top: 0, background: 'rgba(7,8,10,0.92)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Brain style={{ width: 28, height: 28, color: '#b14bf4' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>AI SiteSpark</span>
        </Link>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {[['Features','/features'],['Pricing','/pricing'],['Demos','/demos'],['Contact','/contact']].map(([label,href]) => (
            <Link key={label} href={href} style={{ color: label === 'Features' ? CYAN : '#a1a3ab', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{label}</Link>
          ))}
        </div>
        <Link href="/" style={{ background: CYAN, color: '#000', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>Get Started</Link>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: '999px', background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', color: CYAN, fontSize: '0.8rem', fontWeight: 600, marginBottom: 24 }}>
          <Zap style={{ width: 14, height: 14 }} /> Everything included, out of the box
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', margin: '0 0 20px', letterSpacing: '-1px', lineHeight: 1.15 }}>
          Platform Features
        </h1>
        <p style={{ color: '#a1a3ab', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.75 }}>
          Everything you need to generate, deploy, and convert professional website demos — fully automated.
        </p>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {features.map((f) => (
          <div key={f.title} style={{ background: '#14151a', border: '1px solid #1f222e', borderRadius: 20, padding: '32px', transition: 'border-color 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = CYAN)}
            onMouseOut={e => (e.currentTarget.style.borderColor = '#1f222e')}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,240,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <f.icon style={{ width: 22, height: 22, color: CYAN }} />
            </div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>{f.title}</h3>
            <p style={{ color: '#8b8e98', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', paddingBottom: 80 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: CYAN, color: '#000', padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
          Try It Now <ArrowRight style={{ width: 18, height: 18 }} />
        </Link>
      </div>
    </div>
  );
}
