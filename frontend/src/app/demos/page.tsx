"use client";

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import MarketingShell from '@/components/MarketingShell';

const demos = [
  ['Fashion & Apparel', 'Trendy boutique store with product showcase.'],
  ['Medical & Clinics', 'Professional clinic with appointment CTA.'],
  ['Restaurant & Dining', 'Restaurant site with menu and reservations.'],
  ['Real Estate', 'Property listings for residential and commercial.'],
  ['Education & Academia', 'Programs, admissions, and trust-building content.'],
  ['Digital Agency', 'Service portfolio with strong conversion sections.'],
  ['Interior Design', 'Portfolio-driven studio presentation.'],
  ['Dairy Industry', 'Product-led local business showcase.'],
  ['Temple & Devotional', 'Timings, seva, and devotional content.'],
  ['Social Service & NGO', 'Impact messaging and donation flow.'],
  ['E-Commerce Store', 'Catalog-led shopping experience.'],
  ['Construction & Materials', 'Supplier site with quote request flow.'],
] as const;

export default function DemosPage() {
  return (
    <MarketingShell active="demos">
      <section className="marketing-hero">
        <h1>Browse Demo Templates</h1>
        <p>Explore the current industry coverage and generate a personalised version in under 60 seconds.</p>
      </section>
      <div className="marketing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {demos.map(([industry, desc]) => (
          <article key={industry} className="surface-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 10 }}>{industry}</h3>
            <p className="muted" style={{ minHeight: 48, lineHeight: 1.6, marginBottom: 20 }}>{desc}</p>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Generate Your Own <ExternalLink style={{ width: 15, height: 15 }} />
            </Link>
          </article>
        ))}
      </div>
    </MarketingShell>
  );
}
