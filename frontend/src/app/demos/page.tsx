"use client";
import React from 'react';
import Link from 'next/link';
import { Brain, ExternalLink, Zap } from 'lucide-react';

const CYAN = '#00f0ff';

const demos = [
  { industry: 'Fashion & Apparel',        emoji: '👗', color: '#e91e8c', desc: 'Trendy boutique store with product showcase.' },
  { industry: 'Medical & Clinics',        emoji: '🏥', color: '#0097A7', desc: 'Professional clinic with specialties and appointment CTA.' },
  { industry: 'Restaurant & Dining',      emoji: '🍽️', color: '#E64A19', desc: 'Elegant restaurant with menu and table reservations.' },
  { industry: 'Real Estate',              emoji: '🏘️', color: '#2E7D32', desc: 'Property listings for residential and commercial.' },
  { industry: 'Education & Academia',     emoji: '🎓', color: '#1565C0', desc: 'University portal with programs and admission CTAs.' },
  { industry: 'Digital Agency',           emoji: '⚡', color: '#6A1B9A', desc: 'Dark-mode agency portfolio with services.' },
  { industry: 'Interior Design',          emoji: '🛋️', color: '#C2185B', desc: 'Design studio with portfolio and consultation form.' },
  { industry: 'Dairy Industry',           emoji: '🥛', color: '#00897B', desc: 'Farm-fresh brand with product catalogue.' },
  { industry: 'Temple & Devotional',      emoji: '🛕', color: '#F57F17', desc: 'Temple website with darshan timings and seva.' },
  { industry: 'Social Service & NGO',     emoji: '🤝', color: '#1B5E20', desc: 'NGO with impact stats and donation section.' },
  { industry: 'E-Commerce Store',         emoji: '🛒', color: '#0288D1', desc: 'Shopping interface with categories and deals.' },
  { industry: 'Construction & Materials', emoji: '🏗️', color: '#5D4037', desc: 'Supplier site with products and quote request.' },
];

export default function DemosPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#07080a', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #1f222e', position: 'sticky', top: 0, background: 'rgba(7,8,10,0.92)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Brain style={{ width: 28, height: 28, color: '#b14bf4' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>AI SiteSpark</span>
        </Link>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {[['Features','/features'],['Pricing','/pricing'],['Demos','/demos'],['Contact','/contact']].map(([label,href]) => (
            <Link key={label} href={href} style={{ color: label === 'Demos' ? CYAN : '#a1a3ab', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{label}</Link>
          ))}
        </div>
        <Link href="/" style={{ background: CYAN, color: '#000', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>Get Started</Link>
      </nav>

      <div style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: '999px', background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', color: CYAN, fontSize: '0.8rem', fontWeight: 600, marginBottom: 24 }}>
          <Zap style={{ width: 14, height: 14 }} /> 15+ Industry Templates
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', margin: '0 0 20px', letterSpacing: '-1px', lineHeight: 1.15 }}>Browse Demo Templates</h1>
        <p style={{ color: '#a1a3ab', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.75 }}>
          Explore templates for every industry. Generate a personalised version in under 60 seconds.
        </p>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: CYAN, color: '#000', padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
          Generate My Website <ExternalLink style={{ width: 16, height: 16 }} />
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {demos.map((d) => (
          <div key={d.industry} style={{ background: '#14151a', border: '1px solid #1f222e', borderRadius: 20, overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#1f222e'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ height: 6, background: `linear-gradient(90deg, ${d.color}, ${d.color}88)` }} />
            <div style={{ padding: '28px 24px' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 16 }}>{d.emoji}</div>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{d.industry}</h3>
              <p style={{ color: '#8b8e98', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 24 }}>{d.desc}</p>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: d.color, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', border: `1px solid ${d.color}44`, padding: '8px 16px', borderRadius: 8 }}>
                Generate Your Own <ExternalLink style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
