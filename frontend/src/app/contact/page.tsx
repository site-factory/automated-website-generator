"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Brain, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const CYAN = '#00f0ff';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', service: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Track contact form submission
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'contact_form',
        data: { name: form.name, email: form.email, phone: form.phone, service: form.service, message: form.message }
      })
    }).catch(() => {});
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', background: '#14151a',
    border: '1px solid #1f222e', borderRadius: 10, color: 'white',
    fontSize: '0.95rem', outline: 'none', fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
  };

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
            <Link key={label} href={href} style={{ color: label === 'Contact' ? CYAN : '#a1a3ab', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{label}</Link>
          ))}
        </div>
        <Link href="/" style={{ background: CYAN, color: '#000', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>Get Started</Link>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 100px', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>

        {/* Left: Info */}
        <div style={{ flex: '1 1 280px' }}>
          <p style={{ color: CYAN, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>Get in touch</p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'white', margin: '0 0 20px', lineHeight: 1.2 }}>
            Let&apos;s Build Something Great Together
          </h1>
          <p style={{ color: '#8b8e98', lineHeight: 1.75, marginBottom: 40 }}>
            Have a project in mind? Want a custom template? Need a quick consultation? Drop us a message and we&apos;ll get back within 24 hours.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,240,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail style={{ width: 18, height: 18, color: CYAN }} />
              </div>
              <div>
                <p style={{ color: '#6b6e78', fontSize: '0.75rem', marginBottom: 2 }}>Email</p>
                <a href="mailto:hello@aisitespark.com" style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>hello@aisitespark.com</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,240,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone style={{ width: 18, height: 18, color: CYAN }} />
              </div>
              <div>
                <p style={{ color: '#6b6e78', fontSize: '0.75rem', marginBottom: 2 }}>Phone / WhatsApp</p>
                <a href="tel:+919999999999" style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>+91 99999 99999</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,240,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin style={{ width: 18, height: 18, color: CYAN }} />
              </div>
              <div>
                <p style={{ color: '#6b6e78', fontSize: '0.75rem', marginBottom: 2 }}>Location</p>
                <p style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Hyderabad, Telangana, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div style={{ flex: '1 1 340px', background: '#14151a', border: '1px solid #1f222e', borderRadius: 20, padding: '36px 32px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 style={{ width: 56, height: 56, color: CYAN, margin: '0 auto 20px' }} />
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.3rem', marginBottom: 10 }}>Message Sent!</h3>
              <p style={{ color: '#8b8e98', fontSize: '0.9rem' }}>We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ color: '#8b8e98', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>YOUR NAME</label>
                <input required style={inputStyle} placeholder="Ravi Kumar" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = CYAN} onBlur={e => e.target.style.borderColor = '#1f222e'} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#8b8e98', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>EMAIL</label>
                  <input required type="email" style={inputStyle} placeholder="you@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = CYAN} onBlur={e => e.target.style.borderColor = '#1f222e'} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#8b8e98', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>PHONE</label>
                  <input type="tel" style={inputStyle} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = CYAN} onBlur={e => e.target.style.borderColor = '#1f222e'} />
                </div>
              </div>
              <div>
                <label style={{ color: '#8b8e98', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>SERVICE INTERESTED IN</label>
                <select required style={{ ...inputStyle, cursor: 'pointer' }} value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = CYAN} onBlur={e => e.target.style.borderColor = '#1f222e'}>
                  <option value="">Select a service...</option>
                  <option>Landing Page (₹4,999)</option>
                  <option>Standard Website (₹9,999)</option>
                  <option>Advanced Website (₹14,999)</option>
                  <option>E-Commerce Store (₹24,999)</option>
                  <option>Custom / Enterprise</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#8b8e98', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>MESSAGE</label>
                <textarea required rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Tell us about your business and what you need..."
                  value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = CYAN} onBlur={e => e.target.style.borderColor = '#1f222e'} />
              </div>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: CYAN, color: '#000', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                <Send style={{ width: 16, height: 16 }} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
