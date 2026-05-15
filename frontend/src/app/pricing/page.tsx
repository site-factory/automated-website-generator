"use client";

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import MarketingShell from '@/components/MarketingShell';

const tiers = [
  ['Landing Page', 'Rs 4,999', 'Perfect for campaigns, product launches, or portfolios.', ['1 Page (Home / Landing)', 'Lead Capture Form', 'Mobile Responsive Design', 'Basic SEO Setup', 'Delivery in 3-5 days']],
  ['Standard Website', 'Rs 9,999', 'The ideal online presence for growing businesses.', ['Up to 5 Pages', 'Contact Form & Google Maps', 'Social Media Integration', 'Performance Optimized', 'Delivery in 5-7 days']],
  ['Advanced Website', 'Rs 14,999', 'For brands that need rich content, integrations, and scale.', ['Up to 10 Pages', 'Custom Integrations', 'Advanced SEO Setup', 'Priority Support', 'Delivery in 7-10 days']],
  ['E-Commerce Store', 'Rs 24,999', 'Full-featured online store with catalogue and payments.', ['Unlimited Products', 'Payment Gateway Setup', 'Order Management', 'Mobile App Ready', 'Delivery in 10-14 days']],
] as const;

export default function PricingPage() {
  return (
    <MarketingShell active="pricing">
      <section className="marketing-hero">
        <h1>Pricing Plans</h1>
        <p>Current package structure is preserved for now and can be revised later without changing the product flow.</p>
      </section>
      <div className="marketing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {tiers.map(([name, price, desc, features], index) => (
          <article key={name} className="surface-card" style={{ padding: 24, borderColor: index === 1 ? 'var(--primary)' : undefined }}>
            <h3 style={{ fontSize: '1.08rem', marginBottom: 8 }}>{name}</h3>
            <p className="muted" style={{ minHeight: 44, lineHeight: 1.6, marginBottom: 18 }}>{desc}</p>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 20 }}>{price}</div>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 12, marginBottom: 24 }}>
              {features.map((feature) => (
                <li key={feature} style={{ display: 'flex', gap: 10, color: 'var(--text-body)' }}>
                  <CheckCircle2 style={{ width: 17, height: 17, color: 'var(--primary)', marginTop: 2, flexShrink: 0 }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-cyan" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Get Started
            </Link>
          </article>
        ))}
      </div>
    </MarketingShell>
  );
}
