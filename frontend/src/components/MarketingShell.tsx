import Link from 'next/link';
import { Brain } from 'lucide-react';

interface MarketingShellProps {
  active?: 'features' | 'pricing' | 'demos' | 'contact';
  children: React.ReactNode;
}

const navItems = [
  { key: 'features', label: 'Features', href: '/features' },
  { key: 'pricing', label: 'Pricing', href: '/pricing' },
  { key: 'demos', label: 'Demos', href: '/demos' },
  { key: 'contact', label: 'Contact', href: '/contact' },
] as const;

export default function MarketingShell({ active, children }: MarketingShellProps) {
  return (
    <div className="marketing-page">
      <div className="bg-glow-cyan" />
      <div className="bg-glow-purple" />
      <nav className="marketing-nav">
        <Link href="/" className="marketing-brand">
          <Brain className="marketing-brand-icon" />
          <span>AI SiteSpark</span>
        </Link>
        <div className="marketing-links">
          {navItems.map((item) => (
            <Link key={item.key} href={item.href} className={active === item.key ? 'active' : undefined}>
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/" className="btn-cyan marketing-cta">Get Started</Link>
      </nav>
      {children}
    </div>
  );
}
