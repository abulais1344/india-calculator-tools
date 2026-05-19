import type { Metadata } from 'next';
import Link from 'next/link';
import Schema from '@/app/components/Schema';
import FAQSection from '@/app/components/FAQSection';
import RelatedCalculators from '@/app/components/RelatedCalculators';
import { getCanonicalUrl } from '@/lib/seo-utils';
import {
  ELECTRICITY_GUIDES,
  ELECTRICITY_HUB_FAQS,
  getElectricityCalculatorLinks,
  getElectricityGuideLinks,
  getElectricityHubProviderLinks,
} from '@/lib/electricity-content';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Electricity Bill Calculators by State, Per Unit Rate & Provider | CalcVerse';
  const description = 'Calculate electricity bills instantly for JUSCO, MSEDCL, BESCOM, TNEB and more. Compare per unit rate, slab charges, and state-wise electricity calculators.';
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
  const calculatorLinks = getElectricityCalculatorLinks();
  const guideLinks = getElectricityGuideLinks();
  const providerGroups = getElectricityHubProviderLinks();
  const totalProviderCount = providerGroups.reduce((count, group) => count + group.providers.length, 0);
  const popularSearchPages = [
    {
      title: 'Per Unit Electricity Rate in India',
      path: '/per-unit-electricity-rate-india.html',
      description: 'Generic state and slab-level rate query page.',
    },
    {
      title: 'State Electricity Charges in India',
      path: '/state-electricity-charges-india.html',
      description: 'Entry page for users comparing state-wise billing differences.',
    },
    {
      title: 'Price of 1 kWh Electricity in India',
      path: '/what-is-the-price-of-1-kwh-electricity-in-india.html',
      description: 'Explains 1 unit electricity cost and what changes the actual bill.',
    },
    {
      title: 'JUSCO Electricity Rate',
      path: '/jusco-electricity-rate.html',
      description: 'Jamshedpur-focused provider intent page.',
    },
    {
      title: 'MSEDCL Electricity Rate Per Unit',
      path: '/msedcl-electricity-rate-per-unit.html',
      description: 'Maharashtra provider-intent landing page.',
    },
    {
      title: 'TNEB Electricity Rate Per Unit',
      path: '/tneb-electricity-rate-per-unit.html',
      description: 'Tamil Nadu provider-intent landing page.',
    },
  ];

  return (
    <div className="calculator-container">
      <Schema schema={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Electricity Bill Calculators by State & Provider', description: 'Calculate electricity bills instantly for JUSCO, MSEDCL, BESCOM, TNEB and more using state-wise electricity bill calculators.', url: canonical, isPartOf: { '@type': 'WebSite', name: 'CalcVerse', url: 'https://calcverse.in' } }} />
      <Schema schema={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `https://calcverse.in${item.url}` })) }} />
      <Schema schema={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: ELECTRICITY_HUB_FAQS.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }} />

      <nav className="safe-private">
        {breadcrumbs.map((item, index) => (
          <span key={item.url}>
            {index > 0 && ' / '}
    {
      title: 'TPDDL Electricity Rate Per Unit',
      path: '/tpddl-electricity-rate-per-unit.html',
      description: 'Delhi provider-intent landing page for per unit and bill estimate searches.',
    },
    {
      title: 'BSES Rajdhani Electricity Rate Per Unit',
      path: '/bses-rajdhani-electricity-rate-per-unit.html',
      description: 'Delhi provider-intent page for BSES Rajdhani rate and bill queries.',
    },
            {index < breadcrumbs.length - 1 ? <Link href={item.url}>{item.name}</Link> : item.name}
          </span>
        ))}
      </nav>

    {
      title: 'KSEB Electricity Rate Per Unit',
      path: '/kseb-electricity-rate-per-unit.html',
      description: 'Kerala provider-intent landing page for rate and slab searches.',
    },
    {
      title: 'TANGEDCO Electricity Rate Per Unit',
      path: '/tangedco-electricity-rate-per-unit.html',
      description: 'Tamil Nadu provider-intent landing page for TANGEDCO queries.',
    },
    {
      title: 'BESCOM Electricity Rate Per Unit',
      path: '/bescom-electricity-rate-per-unit.html',
      description: 'Karnataka provider-intent landing page.',
    },
      <section className="hero">
          <span className="chip">Free and No Signup</span>
      path: '/wbsedcl-electricity-rate-per-unit.html',
      description: 'West Bengal provider-intent landing page.',
          <a className="btn" href="#provider-sections">Browse Providers</a>
          <a className="btn secondary" href="#electricity-guides">Open Guides</a>
          <a className="btn secondary" href="#electricity-faqs">View FAQs</a>
        </div>
        <p className="safe-private">Use provider cards below to jump directly to your board and estimate bills by units.</p>
      </section>

      <div className="card content-block">
        <h2>Quick Access: Provider Calculators</h2>
        <p>Open a provider page directly from this list if you already know your electricity board.</p>
        <RelatedCalculators calculators={calculatorLinks} title="Provider Calculators" />
      </div>

      <div className="summary-box">
        <strong>Best way to use this hub:</strong> start with your provider page for slab-aware estimates, then use the billing guides to verify formula, fixed charges, and effective unit cost.
      </div>

      <section className="card content-block">
        <h2>Popular Electricity Rate Searches</h2>
        <p>These pages are built for the exact queries people use when they want a rate answer first and a calculator second.</p>
        <div className="grid calculator-grid">
          {popularSearchPages.map(page => (
            <article key={page.path} className="card">
              <h3>{page.title}</h3>
              <p>{page.description}</p>
              <div className="calc-link-row">
                <Link href={page.path} className="btn secondary">
                  Open Page
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="ad-container">Electricity Calculator Hub • State-wise and Provider-wise Tools</div>

      {providerGroups.map((group, index) => (
        <section key={group.title} id={index === 0 ? 'provider-sections' : undefined} className="card content-block">
          <h2>{group.title} Calculators</h2>
          <p>{group.description}</p>
          <div className="grid calculator-grid electricity-provider-grid">
            {group.providers.map(provider => (
              <article key={provider.slug} className="card electricity-provider-card">
                <h3>{provider.name} Bill Calculator</h3>
                <p>
                  <strong>State:</strong> {provider.state}
                </p>
                <p>
                  <strong>Approx Rate:</strong> Rs {provider.unitRate.toFixed(2)}/kWh
                </p>
                <p>{provider.summary}</p>
                <div className="calc-link-row">
                  <Link href={`/electricity/${provider.slug}`} className="btn">
                    Open {provider.name}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="card content-block">
        <h2>How Electricity Billing Works in India</h2>
        <p>Electricity bills usually combine energy charges, fixed charges, and taxes. Slab pricing means your average rate can rise as monthly usage increases.</p>
        <ul>
          <li>Read the meter and note the units consumed for the billing period.</li>
          <li>Multiply units by the applicable slab rate for your provider.</li>
          <li>Add fixed charges, meter charges, and other provider-specific fees.</li>
          <li>Check the final estimate with the right provider calculator before paying.</li>
        </ul>
        <div className="calc-link-row">
          {ELECTRICITY_GUIDES.slice(0, 4).map(guide => (
            <Link key={guide.slug} className="btn secondary" href={`/electricity/${guide.slug}`}>
              {guide.title}
            </Link>
          ))}
        </div>
      </section>

      <section id="electricity-guides" className="card content-block">
        <h2>Electricity Guides</h2>
        <p>Read concise explainers for slab rates, per-unit cost, fixed vs energy charges, and bill formulas.</p>
        <div className="grid calculator-grid">
          {guideLinks.map(link => (
            <article key={link.path} className="card">
              <h3>{link.name}</h3>
              <p>{link.description}</p>
              <div className="calc-link-row">
                <Link href={link.path} className="btn secondary">
                  Read Guide
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="electricity-faqs" className="card content-block">
        <FAQSection faqs={ELECTRICITY_HUB_FAQS} />
      </section>
    </div>
  );
}
