"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers3 } from 'lucide-react';
import MarketingShell from '@/components/MarketingShell';
import { demoIndustries, templateStyles } from '@/lib/traction-content';

const previewCards = demoIndustries.flatMap((industry, industryIndex) =>
  templateStyles.map((style, styleIndex) => ({
    id: `${industry.slug}-${style.value}`,
    ...industry,
    style,
    pattern: `linear-gradient(135deg, ${industry.accent}22, #ffffff 45%, ${styleIndex % 2 ? '#ecfeff' : '#f8fafc'}), radial-gradient(circle at ${22 + industryIndex * 9}% ${18 + styleIndex * 8}%, ${industry.accent}55, transparent 24%)`,
  })),
);

export default function DemosPage() {
  const [industryFilter, setIndustryFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');

  const filteredCards = useMemo(() => previewCards.filter((card) => (
    (industryFilter === 'all' || card.slug === industryFilter)
    && (styleFilter === 'all' || card.style.value === styleFilter)
  )), [industryFilter, styleFilter]);

  return (
    <MarketingShell active="demos">
      <section className="marketing-hero">
        <span className="marketing-eyebrow">Template proof library</span>
        <h1>Browse demo directions before generating your own.</h1>
        <p>Filter by business type and visual strategy, then start with the closest direction for your own website demo.</p>
      </section>

      <section className="demo-filter-bar" aria-label="Demo filters">
        <select value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)} aria-label="Filter by industry">
          <option value="all">All industries</option>
          {demoIndustries.map((industry) => (
            <option key={industry.slug} value={industry.slug}>{industry.label}</option>
          ))}
        </select>
        <select value={styleFilter} onChange={(event) => setStyleFilter(event.target.value)} aria-label="Filter by template style">
          <option value="all">All styles</option>
          {templateStyles.map((style) => (
            <option key={style.value} value={style.value}>{style.label}</option>
          ))}
        </select>
        <span>{filteredCards.length} preview directions</span>
      </section>

      <section className="demo-gallery-grid">
        {filteredCards.map((card) => (
          <article className="demo-preview-card surface-card" key={card.id}>
            <div className="demo-preview-visual" style={{ background: card.pattern }}>
              <div className="demo-browser-bar"><span /><span /><span /></div>
              <div className="demo-preview-layout">
                <div />
                <div />
                <div />
              </div>
            </div>
            <div className="demo-preview-body">
              <span className="demo-style-pill"><Layers3 size={14} /> {card.style.label}</span>
              <h3>{card.label}</h3>
              <p>{card.useCase}</p>
              <p className="muted">{card.style.tone}</p>
              <Link href={`/?industry=${encodeURIComponent(card.industry)}&templateStyle=${card.style.value}`} className="demo-card-link">
                Generate Similar Website <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </MarketingShell>
  );
}
