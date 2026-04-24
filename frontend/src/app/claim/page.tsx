"use client";

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, Mail, Sparkles, Phone } from 'lucide-react';

const CYAN = '#00f0ff';
const BG_DARK = '#07080a';
const CARD_BG = '#14151a';
const BORDER = '#1f222e';
const TEXT_MUTED = '#8b8e98';
const TEXT_DIM = '#a1a3ab';

const tiers = [
  {
    name: 'Landing Page',
    desc: 'Perfect for campaigns, product launches, or single-page portfolios.',
    price: '₹4,999',
    period: 'one-time',
    features: ['1 Page (Home / Landing)', 'Lead Capture Form', 'Mobile Responsive', 'Basic SEO Setup'],
    highlight: false,
  },
  {
    name: 'Standard Website',
    desc: 'The ideal online presence for growing businesses needing multiple pages.',
    price: '₹9,999',
    period: 'one-time',
    features: ['Up to 5 Pages', 'Contact Form & Maps', 'Social Media Integration', 'Performance Optimized'],
    highlight: true,
  },
  {
    name: 'Advanced Website',
    desc: 'For established brands that need rich content, integrations, and scale.',
    price: '₹14,999',
    period: 'one-time',
    features: ['Up to 10 Pages', 'Custom Integrations', 'Advanced SEO Setup', 'Priority Support'],
    highlight: false,
  },
];

function ClaimContent() {
  const searchParams = useSearchParams();
  const demoId = searchParams.get('demo');

  // Track claim page visit
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'claim_visit',
        data: { demoId: demoId || '', referrer: typeof document !== 'undefined' ? document.referrer : '' }
      })
    }).catch(() => {});
  }, [demoId]);

  return (
    <div style={{
      minHeight: '100vh',
      background: BG_DARK,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 24px 60px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* Background glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: CYAN, borderRadius: '50%', filter: 'blur(140px)', opacity: 0.07, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: CYAN, borderRadius: '50%', filter: 'blur(140px)', opacity: 0.07, pointerEvents: 'none' }} />

      {/* ── HEADER ── */}
      <div style={{ textAlign: 'center', maxWidth: '720px', width: '100%', zIndex: 1 }}>

        {/* Pill badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 18px', borderRadius: '999px',
          background: 'rgba(0,240,255,0.08)', border: `1px solid rgba(0,240,255,0.2)`,
          color: CYAN, fontSize: '13px', fontWeight: 600,
          marginBottom: '28px',
        }}>
          <Sparkles style={{ width: 14, height: 14 }} />
          Step 2: Make it yours
        </div>

        {/* Main heading */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          fontWeight: 800, color: '#ffffff',
          lineHeight: 1.15, letterSpacing: '-1px',
          margin: '0 0 24px 0',
        }}>
          Ready to claim your website?
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.1rem', color: TEXT_DIM,
          lineHeight: 1.75, margin: '0 auto 24px',
          maxWidth: '580px',
        }}>
          You loved the demo. Now let&apos;s connect it to your custom domain, customize the final details, and launch it to the world.
        </p>

        {/* Demo Ref badge */}
        {demoId && (
          <div style={{
            display: 'inline-block',
            background: 'rgba(0,240,255,0.05)', border: `1px solid rgba(0,240,255,0.15)`,
            borderRadius: '8px', padding: '8px 20px',
            color: CYAN, fontSize: '13px', fontFamily: 'monospace',
            marginBottom: '0',
          }}>
            Demo Ref: {demoId}
          </div>
        )}
      </div>

      {/* ── SPACER ── */}
      <div style={{ height: '64px' }} />

      {/* ── PRICING CARDS ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '24px',
        justifyContent: 'center', alignItems: 'stretch',
        width: '100%', maxWidth: '1100px', zIndex: 1,
      }}>
        {tiers.map((tier) => (
          <div key={tier.name} style={{
            flex: '1 1 300px', maxWidth: '360px',
            background: CARD_BG,
            border: `1px solid ${tier.highlight ? CYAN : BORDER}`,
            borderRadius: '20px',
            padding: '36px 32px',
            display: 'flex', flexDirection: 'column',
            position: 'relative',
            boxShadow: tier.highlight ? `0 8px 40px rgba(0,240,255,0.1)` : 'none',
            transition: 'border-color 0.2s',
          }}>
            {/* Recommended badge */}
            {tier.highlight && (
              <div style={{
                position: 'absolute', top: 0, right: 0,
                background: CYAN, color: '#000',
                fontSize: '10px', fontWeight: 700,
                padding: '6px 14px',
                borderRadius: '0 20px 0 12px',
                textTransform: 'uppercase', letterSpacing: '0.8px',
              }}>
                Recommended
              </div>
            )}

            {/* Tier name */}
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', margin: '0 0 10px 0' }}>
              {tier.name}
            </h3>

            {/* Tier desc */}
            <p style={{ fontSize: '0.875rem', color: TEXT_MUTED, lineHeight: 1.6, margin: '0 0 28px 0', minHeight: '60px' }}>
              {tier.desc}
            </p>

            {/* Price */}
            <div style={{ margin: '0 0 28px 0' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>{tier.price}</span>
              <span style={{ fontSize: '0.85rem', color: TEXT_MUTED, marginLeft: '8px' }}>{tier.period}</span>
            </div>

            {/* Features */}
            <ul style={{ listStyle: 'none', margin: '0 0 32px 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              {tier.features.map((feat) => (
                <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.5 }}>
                  <CheckCircle2 style={{ width: 18, height: 18, color: CYAN, flexShrink: 0, marginTop: '2px' }} />
                  {feat}
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <button style={{
              width: '100%', padding: '14px',
              borderRadius: '12px', border: 'none',
              background: tier.highlight ? CYAN : BORDER,
              color: tier.highlight ? '#000' : '#fff',
              fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: tier.highlight ? `0 0 20px rgba(0,240,255,0.25)` : 'none',
              transition: 'opacity 0.2s',
            }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {/* ── SPACER ── */}
      <div style={{ height: '56px' }} />

      {/* ── CONTACT STRIP ── */}
      <div style={{
        width: '100%', maxWidth: '1100px', zIndex: 1,
        background: '#0c0e14', border: `1px solid ${BORDER}`,
        borderRadius: '16px', padding: '28px 36px',
        display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'space-between',
        gap: '20px',
      }}>
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem', margin: '0 0 6px 0' }}>
            Have questions before claiming?
          </h4>
          <p style={{ color: TEXT_MUTED, fontSize: '0.875rem', margin: 0 }}>
            Reach us at{' '}
            <a href="mailto:hello@aisitespark.com" style={{ color: CYAN, textDecoration: 'none' }}>
              hello@aisitespark.com
            </a>
            {' '}or book a quick 15-min call.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="mailto:hello@aisitespark.com" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '999px',
            background: CARD_BG, border: `1px solid ${BORDER}`,
            color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
          }}>
            <Mail style={{ width: 16, height: 16 }} /> Email Us
          </a>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '999px',
            background: CARD_BG, border: `1px solid ${BORDER}`,
            color: '#fff', fontSize: '0.875rem', fontWeight: 600,
            cursor: 'pointer',
          }}>
            <Calendar style={{ width: 16, height: 16 }} /> Book a Call
          </button>
        </div>
      </div>

    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: BG_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f0ff', fontFamily: 'Inter, sans-serif' }}>
        Loading...
      </div>
    }>
      <ClaimContent />
    </Suspense>
  );
}
