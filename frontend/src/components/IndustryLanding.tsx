import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import MarketingShell from '@/components/MarketingShell';
import { industryPages, templateStyles, type IndustryPageSlug } from '@/lib/traction-content';

interface IndustryLandingProps {
  slug: IndustryPageSlug;
}

export default function IndustryLanding({ slug }: IndustryLandingProps) {
  const page = industryPages[slug];
  const wizardHref = `/?industry=${encodeURIComponent(page.industry)}&templateStyle=v6`;

  return (
    <MarketingShell>
      <section className="industry-landing-hero">
        <div>
          <span className="marketing-eyebrow">{page.eyebrow}</span>
          <h1>{page.headline}</h1>
          <p>{page.intro}</p>
          <Link className="btn-cyan industry-landing-cta" href={wizardHref}>
            Generate a demo <ArrowRight size={17} />
          </Link>
        </div>
        <div className="industry-preview-panel surface-card">
          <div className="demo-browser-bar"><span /><span /><span /></div>
          <div className="industry-preview-hero" />
          <div className="industry-preview-lines">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="industry-proof-grid">
        <div className="surface-card industry-proof-card">
          <h2>Problems this solves</h2>
          {page.pains.map((pain) => (
            <p key={pain}><CheckCircle2 size={16} /> {pain}</p>
          ))}
        </div>
        <div className="surface-card industry-proof-card">
          <h2>What the demo includes</h2>
          {page.benefits.map((benefit) => (
            <p key={benefit}><CheckCircle2 size={16} /> {benefit}</p>
          ))}
        </div>
      </section>

      <section className="industry-template-strip">
        <div className="home-section-head">
          <span className="marketing-eyebrow">Template directions</span>
          <h2>Start with a style that matches the business goal.</h2>
        </div>
        <div className="industry-template-grid">
          {templateStyles.slice(3).map((style) => (
            <article className="surface-card industry-template-card" key={style.value}>
              <span>{style.label}</span>
              <h3>{style.tone}</h3>
              <Link href={`/?industry=${encodeURIComponent(page.industry)}&templateStyle=${style.value}`}>
                Use this direction <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
