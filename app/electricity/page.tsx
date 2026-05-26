import type { Metadata } from 'next';
import Link from 'next/link';
import Schema from '@/app/components/Schema';
import FAQSection from '@/app/components/FAQSection';
import { getCanonicalUrl } from '@/lib/seo-utils';
import {
  ELECTRICITY_CALCULATOR_CLUSTERS,
  ELECTRICITY_GUIDES,
  ELECTRICITY_HUB_FAQS,
  getElectricityGuideLinks,
  getElectricityHubProviderLinks,
} from '@/lib/electricity-content';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Electricity Bill India: State Calculators, Unit Rate, Slabs & Tariff Guides | CalcVerse';
  const description =
    'Own your electricity bill planning in India with provider calculators, per unit rate pages, slab explainers, and tariff guides for all major state boards.';
  const canonical = getCanonicalUrl('/electricity');

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
  };
}

export default function ElectricityHubPage() {
  const canonical = getCanonicalUrl('/electricity');
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Electricity', url: '/electricity' },
  ];
  const guideLinks = getElectricityGuideLinks();
  const providerGroups = getElectricityHubProviderLinks();
  const totalProviderCount = providerGroups.reduce((count, group) => count + group.providers.length, 0);

  return (
    <div className="calculator-container">
      <Schema
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Electricity Bill Calculators by State & Provider',
          description:
            'Calculate electricity bills instantly for JUSCO, MSEDCL, BESCOM, TNEB and more using state-wise electricity bill calculators.',
          url: canonical,
          isPartOf: {
            '@type': 'WebSite',
            name: 'CalcVerse',
            url: 'https://calcverse.in',
          },
        }}
      />
      <Schema
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `https://calcverse.in${item.url}`,
          })),
        }}
      />
      <Schema
        schema={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: ELECTRICITY_HUB_FAQS.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />

      <nav className="safe-private">
        {breadcrumbs.map((item, index) => (
          <span key={item.url}>
            {index > 0 && ' / '}
            {index < breadcrumbs.length - 1 ? <Link href={item.url}>{item.name}</Link> : item.name}
          </span>
        ))}
      </nav>

      <section className="hero">
        <h1>Electricity Bill Calculators by State & Provider</h1>
        <p>
          Estimate your electricity bill instantly with slab-aware calculators for {totalProviderCount}+ major
          providers. Get tariff rates, billing guides, and bill optimization tips in one place.
        </p>
        <div className="blog-meta">
          <span className="chip">{totalProviderCount} Providers</span>
          <span className="chip">Updated for 2026</span>
          <span className="chip">Free and No Signup</span>
        </div>
        <div className="hero-actions">
          <a className="btn" href="#start-calculator">
            Find Your Provider
          </a>
          <a className="btn secondary" href="#core-guides">
            View Billing Guides
          </a>
          <a className="btn secondary" href="#solar-electricity">
            Solar Electricity
          </a>
          <a className="btn secondary" href="#electricity-faqs">
            View FAQs
          </a>
        </div>
      </section>

      <section id="start-calculator" className="card content-block">
        <h2>Find Your Electricity Provider</h2>
        <p>Select your state to jump directly to your provider&apos;s calculator and start estimating your bill by units.</p>
        <div className="grid calculator-grid">
          {providerGroups.map(group => (
            <div key={group.title} className="card">
              <h3>{group.title}</h3>
              <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '12px' }}>
                {group.providers.length} provider{group.providers.length > 1 ? 's' : ''}
              </p>
              <div className="calc-link-row" style={{ flexDirection: 'column', gap: '8px' }}>
                {group.providers.map(provider => (
                  <Link
                    key={provider.slug}
                    href={`/electricity/${provider.slug}`}
                    className="btn secondary"
                    style={{ textAlign: 'left', fontSize: '0.9em' }}
                  >
                    {provider.name} ({provider.state})
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card content-block" style={{ borderLeft: '4px solid #8b5cf6', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%)' }}>
        <h2>🎯 Explore by Topic</h2>
        <p>
          Navigate electricity calculators and guides by specific intent: bill estimation, tariff
          understanding, bill reduction, or advanced billing topics.
        </p>
        <div className="grid calculator-grid">
          {ELECTRICITY_CALCULATOR_CLUSTERS.map(cluster => (
            <article key={cluster.title} className="card">
              <h3>{cluster.title}</h3>
              <p style={{ fontSize: '0.9em', minHeight: '50px' }}>{cluster.intent}</p>
              <div className="calc-link-row" style={{ flexWrap: 'wrap', gap: '6px' }}>
                {cluster.links.slice(0, cluster.title === 'Advanced Billing Topics' ? 4 : 3).map(link => (
                  <Link key={link.path} href={link.path} className="btn secondary" style={{ fontSize: '0.85em' }}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card content-block" style={{ borderLeft: '4px solid #7c3aed', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%)' }}>
        <h2>❓ Quick Answers: Specific Scenarios</h2>
        <p>
          Find answers for common electricity questions: 100-unit bills, reading meters, peak vs
          off-peak tariffs, solar net metering, and more.
        </p>
        <div className="calc-link-row" style={{ flexWrap: 'wrap' }}>
          <Link href="/electricity/electricity-bill-100-units-india" className="btn secondary">
            100 Units Bill
          </Link>
          <Link href="/electricity/electricity-bill-200-units-india" className="btn secondary">
            200 Units Bill
          </Link>
          <Link href="/electricity/how-to-read-electricity-meter-india" className="btn secondary">
            Read Your Meter
          </Link>
          <Link href="/electricity/peak-vs-off-peak-electricity-india" className="btn secondary">
            Peak vs Off-Peak
          </Link>
          <Link href="/electricity/solar-net-metering-bill-explained" className="btn secondary">
            Solar Net Metering
          </Link>
          <Link href="/electricity/how-to-reduce-electricity-bill-india" className="btn secondary">
            Reduce Your Bill
          </Link>
        </div>
      </section>

      <section
        id="solar-electricity"
        className="card content-block"
        style={{ borderLeft: '4px solid #16a34a', background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(34, 197, 94, 0.06) 100%)' }}
      >
        <h2>☀️ Solar Electricity Planning</h2>
        <p>
          Planning rooftop solar? Understand net metering, residual electricity bills, and how fixed
          charges still apply after solar installation.
        </p>
        <div className="calc-link-row" style={{ flexWrap: 'wrap' }}>
          <Link href="/electricity/solar-net-metering-bill-explained" className="btn">
            Solar Net Metering Guide
          </Link>
          <Link href="/electricity/fixed-charge-vs-energy-charge" className="btn secondary">
            Fixed vs Energy Charge
          </Link>
          <Link href="/electricity/tod-tariff-time-of-day-explained" className="btn secondary">
            TOD Tariff for Solar Users
          </Link>
          <Link href="/electricity/how-to-reduce-electricity-bill-india" className="btn secondary">
            Reduce Bill with Usage Strategy
          </Link>
        </div>
      </section>

      <section className="card content-block" style={{ borderLeft: '4px solid #d97706', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(245, 158, 11, 0.06) 100%)' }}>
        <h2>🎯 Reference Data</h2>
        <p>
          Use our public JSON reference file for electricity rates across Indian providers.
          Perfect for newsroom, research, and blog references.
        </p>
        <div className="calc-link-row">
          <Link href="/electricity-rate-reference-india-2026.json" className="btn secondary">
            View Electricity Rate Reference JSON
          </Link>
        </div>
      </section>

      <section className="card content-block" style={{ borderLeft: '4px solid #d97706', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(245, 158, 11, 0.06) 100%)' }}>
        <h2>📊 Understand Your Electricity Bill</h2>
        <p>
          Electricity bills combine energy charges, fixed charges, and taxes. Slab pricing means your
          average rate rises with higher usage. Learn the formula and optimize your bill.
        </p>
        <ul style={{ marginBottom: '16px' }}>
          <li><strong>Read your meter:</strong> Note units consumed for the billing period.</li>
          <li><strong>Apply slab rates:</strong> Multiply units by the rate for your usage bracket.</li>
          <li><strong>Add fixed charges:</strong> Include meter charges and provider-specific fees.</li>
          <li><strong>Calculate taxes:</strong> Factor in duty, surcharges, and applicable GST.</li>
        </ul>
        <div className="calc-link-row" style={{ flexWrap: 'wrap' }}>
          {ELECTRICITY_GUIDES.slice(0, 6).map(guide => (
            <Link key={guide.slug} className="btn secondary" href={`/electricity/${guide.slug}`}>
              {guide.title}
            </Link>
          ))}
        </div>
      </section>

      <section id="core-guides" className="card content-block" style={{ borderLeft: '4px solid #0891b2', background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.08) 0%, rgba(34, 211, 238, 0.06) 100%)' }}>
        <h2>📚 Core Electricity Guides</h2>
        <div className="grid calculator-grid">
          {guideLinks.slice(0, 12).map(link => (
            <article key={link.path} className="card">
              <h3>{link.name}</h3>
              <p style={{ fontSize: '0.9em' }}>{link.description}</p>
              <div className="calc-link-row">
                <Link href={link.path} className="btn secondary">
                  Read Guide
                </Link>
              </div>
            </article>
          ))}
        </div>
        {guideLinks.length > 12 && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link href="/electricity/all-guides" className="btn" style={{ display: 'inline-block' }}>
              View All {guideLinks.length} Guides →
            </Link>
          </div>
        )}
      </section>

      <section id="electricity-faqs" className="card content-block" style={{ borderLeft: '4px solid #6366f1', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)' }}>
        <h2>❓ Frequently Asked Questions</h2>
        <FAQSection faqs={ELECTRICITY_HUB_FAQS} />
      </section>
    </div>
  );
}
