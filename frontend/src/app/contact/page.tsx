import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import MarketingShell from '@/components/MarketingShell';

export default function ContactPage() {
  const email = 'support@teadustech.com';
  const phone = '9703527689';
  const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent('Hi Teadustech, I want to discuss a website demo.')}`;

  return (
    <MarketingShell active="contact">
      <section className="marketing-hero">
        <h1>Contact</h1>
        <p>Reach Teadustech for website demo support, launch discussions, and product enquiries.</p>
      </section>
      <div className="marketing-grid" style={{ gridTemplateColumns: 'minmax(260px, 0.8fr) minmax(320px, 1.2fr)', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          {[
            [Mail, 'Email', email],
            [Phone, 'Phone', phone],
            [MessageCircle, 'WhatsApp', `+91 ${phone}`],
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
        <div className="surface-card" style={{ padding: 28, display: 'grid', gap: 18 }}>
          <span className="marketing-eyebrow">Fastest response</span>
          <h2 style={{ margin: 0 }}>Talk to Teadustech directly.</h2>
          <p className="muted" style={{ margin: 0 }}>
            The contact form is hidden for now. Use email or WhatsApp so every enquiry reaches the owner workflow directly.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a href={`mailto:${email}`} className="btn-cyan" style={{ textDecoration: 'none' }}>Email Support</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>Message on WhatsApp</a>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
