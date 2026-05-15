"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Mail } from 'lucide-react';
import MarketingShell from '@/components/MarketingShell';

const tiers = [
  ['Landing Page', 'Rs 4,999', ['1 Page', 'Lead Capture Form', 'Mobile Responsive', 'Basic SEO Setup']],
  ['Standard Website', 'Rs 9,999', ['Up to 5 Pages', 'Contact Form & Maps', 'Social Integration', 'Performance Optimized']],
  ['Advanced Website', 'Rs 14,999', ['Up to 10 Pages', 'Custom Integrations', 'Advanced SEO', 'Priority Support']],
] as const;

function ClaimContent() {
  const searchParams = useSearchParams();
  const demoId = searchParams.get('demo');

  return (
    <MarketingShell>
      <section className="marketing-hero">
        <h1>Ready to claim your website?</h1>
        <p>Your demo is already generated. Choose a package and continue the conversation with the agency team.</p>
        {demoId ? <p style={{ marginTop: 16, fontWeight: 600 }}>Demo Ref: {demoId}</p> : null}
      </section>
      <div className="marketing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {tiers.map(([name, price, features], index) => (
          <article key={name} className="surface-card" style={{ padding: 24, borderColor: index === 1 ? 'var(--primary)' : undefined }}>
            <h3 style={{ marginBottom: 10 }}>{name}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 18 }}>{price}</div>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 12, marginBottom: 24 }}>
              {features.map((feature) => (
                <li key={feature} style={{ display: 'flex', gap: 10, color: 'var(--text-body)' }}>
                  <CheckCircle2 style={{ width: 17, height: 17, color: 'var(--primary)', marginTop: 2, flexShrink: 0 }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="btn-cyan" style={{ border: 0, width: '100%' }}>Select Plan</button>
          </article>
        ))}
      </div>
      <div className="surface-card" style={{ maxWidth: 1120, margin: '0 auto 5rem', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ marginBottom: 6 }}>Need help choosing?</h3>
          <p className="muted">Reach us directly and we will help finalise the right package.</p>
        </div>
        <a href="mailto:hello@aisitespark.com" className="btn-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <Mail style={{ width: 16, height: 16 }} /> Email Us
        </a>
      </div>
    </MarketingShell>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
      <ClaimContent />
    </Suspense>
  );
}
