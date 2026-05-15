"use client";

import { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import MarketingShell from '@/components/MarketingShell';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', service: '' });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid var(--border)',
    borderRadius: 12,
    fontSize: '0.95rem',
    fontFamily: 'inherit',
  };

  return (
    <MarketingShell active="contact">
      <section className="marketing-hero">
        <h1>Contact</h1>
        <p>Use this page for direct enquiries while the demo funnel handles automated lead capture.</p>
      </section>
      <div className="marketing-grid" style={{ gridTemplateColumns: 'minmax(260px, 0.8fr) minmax(320px, 1.2fr)', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          {[
            [Mail, 'Email', 'hello@aisitespark.com'],
            [Phone, 'Phone / WhatsApp', '+91 99999 99999'],
            [MapPin, 'Location', 'Hyderabad, Telangana, India'],
          ].map(([Icon, label, value]) => (
            <div key={String(label)} className="surface-card" style={{ padding: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
              <Icon style={{ width: 20, height: 20, color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>{String(label)}</div>
                <div style={{ fontWeight: 600 }}>{String(value)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="surface-card" style={{ padding: 28 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 style={{ width: 52, height: 52, color: 'var(--primary)', margin: '0 auto 16px' }} />
              <h3 style={{ marginBottom: 8 }}>Message Sent</h3>
              <p className="muted">We will get back within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} style={{ display: 'grid', gap: 16 }}>
              <input required placeholder="Your name" style={inputStyle} value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <input required type="email" placeholder="Email" style={inputStyle} value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
                <input placeholder="Phone" style={inputStyle} value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
              </div>
              <select required style={inputStyle} value={form.service} onChange={(event) => setForm((prev) => ({ ...prev, service: event.target.value }))}>
                <option value="">Select a service</option>
                <option>Landing Page</option>
                <option>Standard Website</option>
                <option>Advanced Website</option>
                <option>E-Commerce Store</option>
                <option>Custom / Enterprise</option>
              </select>
              <textarea required rows={5} placeholder="Tell us about your business and what you need" style={{ ...inputStyle, resize: 'vertical' }} value={form.message} onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))} />
              <button type="submit" className="btn-cyan" style={{ border: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Send style={{ width: 16, height: 16 }} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </MarketingShell>
  );
}
