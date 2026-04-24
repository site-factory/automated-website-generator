"use client";
import React from 'react';
import Link from 'next/link';
import { Brain, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

const CYAN = '#00f0ff';

const tiers = [
  {
    name: 'Landing Page',
    price: '₹4,999',
    period: 'one-time',
    highlight: false,
    badge: null,
    desc: 'Perfect for campaigns, product launches, or portfolios.',
    features: ['1 Page (Home / Landing)', 'Lead Capture Form', 'Mobile Responsive Design', 'Basic SEO Setup', 'Delivery in 3–5 days'],
  },
  {
    name: 'Standard Website',
    price: '₹9,999',
    period: 'one-time',
    highlight: true,
    badge: 'Most Popular',
    desc: 'The ideal online presence for growing businesses.',
    features: ['Up to 5 Pages', 'Contact Form & Google Maps', 'Social Media Integration', 'Performance Optimized', 'Delivery in 5–7 days'],
  },
  {
    name: 'Advanced Website',
    price: '₹14,999',
    period: 'one-time',
    highlight: false,
    badge: null,
    desc: 'For brands that need rich content, integrations, and scale.',
    features: ['Up to 10 Pages', 'Custom Integrations', 'Advanced SEO Setup', 'Priority Support', 'Delivery in 7–10 days'],
  },
  {
    name: 'E-Commerce Store',
    price: '₹24,999',
    period: 'one-time',
    highlight: false,
    badge: null,
    desc: 'Full-featured online store with product catalogue and payments.',
    features: ['Unlimited Products', 'Payment Gateway Setup', 'Order Management', 'Mobile App Ready', 'Delivery in 10–14 days'],
  },
];

export default function PricingPage() {
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
            <Link key={label} href={href} style={{ color: label === 'Pricing' ? CYAN : '#a1a3ab', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{label}</Link>
          ))}
        </div>
        <Link href="/" style={{ background: CYAN, color: '#000', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>Get Started</Link>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: '999px', background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', color: CYAN, fontSize: '0.8rem', fontWeight: 600, marginBottom: 24 }}>
          <Zap style={{ width: 14, height: 14 }} /> Simple, transparent pricing
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', margin: '0 0 20px', letterSpacing: '-1px', lineHeight: 1.15 }}>
          Pricing Plans
        </h1>
        <p style={{ color: '#a1a3ab', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto 16px', lineHeight: 1.75 }}>
          All prices are in Indian Rupees. No hidden charges. One-time payment, lifetime ownership.
        </p>
        <p style={{ color: '#6b6e78', fontSize: '0.875rem' }}>All websites are FSSAI/GST invoice eligible. Inquire for custom quotes.</p>
      </div>

      {/* Pricing Cards */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', alignItems: 'stretch' }}>
        {tiers.map((t) => (
          <div key={t.name} style={{
            flex: '1 1 240px', maxWidth: 280,
            background: '#14151a',
            border: `1px solid ${t.highlight ? CYAN : '#1f222e'}`,
            borderRadius: 20, padding: '32px 28px',
            display: 'flex', flexDirection: 'column',
            position: 'relative',
            boxShadow: t.highlight ? `0 8px 40px rgba(0,240,255,0.08)` : 'none',
          }}>
            {t.badge && (
              <div style={{ position: 'absolute', top: 0, right: 0, background: CYAN, color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '5px 14px', borderRadius: '0 20px 0 10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {t.badge}
              </div>
            )}
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, marginTop: t.badge ? 8 : 0 }}>{t.name}</h3>
            <p style={{ color: '#8b8e98', fontSize: '0.85rem', marginBottom: 24, lineHeight: 1.55 }}>{t.desc}</p>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white' }}>{t.price}</span>
              <span style={{ color: '#6b6e78', fontSize: '0.8rem', marginLeft: 6 }}>{t.period}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {t.features.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#a1a3ab', fontSize: '0.875rem' }}>
                  <CheckCircle2 style={{ width: 16, height: 16, color: CYAN, flexShrink: 0, marginTop: 2 }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/contact" style={{
              display: 'block', textAlign: 'center', padding: '13px',
              borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
              background: t.highlight ? CYAN : '#1f222e', color: t.highlight ? '#000' : 'white',
            }}>
              Get Started
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ Note */}
      <div style={{ textAlign: 'center', paddingBottom: 80, color: '#6b6e78', fontSize: '0.875rem' }}>
        Need a custom quote?{' '}
        <Link href="/contact" style={{ color: CYAN, textDecoration: 'none' }}>Contact us</Link> — we&apos;re happy to help.
      </div>
    </div>
  );
}
