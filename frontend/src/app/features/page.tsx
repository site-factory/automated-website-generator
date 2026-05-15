"use client";

import Link from 'next/link';
import { ArrowRight, BarChart3, Cpu, GitBranch, Globe, Palette, Smartphone } from 'lucide-react';
import MarketingShell from '@/components/MarketingShell';

const features = [
  ['AI-Powered Generation', 'Generate a structured demo flow from business inputs in under 60 seconds.', Cpu],
  ['Curated Color Palettes', 'Apply harmonious multi-color palettes across every generated page.', Palette],
  ['Live GitHub Pages Deploy', 'Publish each demo to a real shareable URL without manual setup.', Globe],
  ['Mobile-First Templates', 'Ship responsive layouts built for Indian business audiences and devices.', Smartphone],
  ['15+ Industry Templates', 'Cover major service, retail, healthcare, and local business verticals.', GitBranch],
  ['Conversion-Ready CTA', 'Guide prospects from demo preview into an owner-controlled WhatsApp funnel.', BarChart3],
] as const;

export default function FeaturesPage() {
  return (
    <MarketingShell active="features">
      <section className="marketing-hero">
        <h1>Platform Features</h1>
        <p>Everything needed to generate, deploy, and convert polished website demos in one flow.</p>
      </section>
      <div className="marketing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {features.map(([title, desc, Icon]) => (
          <article key={title} className="surface-card" style={{ padding: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Icon style={{ width: 22, height: 22, color: 'var(--primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 10 }}>{title}</h3>
            <p className="muted" style={{ lineHeight: 1.7 }}>{desc}</p>
          </article>
        ))}
      </div>
      <div style={{ textAlign: 'center', paddingBottom: 80 }}>
        <Link href="/" className="btn-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          Try It Now <ArrowRight style={{ width: 18, height: 18 }} />
        </Link>
      </div>
    </MarketingShell>
  );
}
