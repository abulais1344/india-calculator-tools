import type { Metadata } from 'next';
import Link from 'next/link';
import Schema from '@/app/components/Schema';
import RelatedCalculators from '@/app/components/RelatedCalculators';
import { getCanonicalUrl } from '@/lib/seo-utils';
import {
  FINANCE_GUIDES,
  getFinanceGuideLinks,
  getFinanceGuidesByCluster,
} from '@/lib/finance-content';

export async function generateMetadata(): Promise<Metadata> {
  const canonical = getCanonicalUrl('/finance');
  return {
    title: 'Finance Planning Guides: Loan, SIP, Tax, Salary, and Budgeting | CalcVerse',
    description:
      'Explore practical finance planning guides for EMI, loan eligibility, SIP strategy, tax choices, salary planning, and monthly budgeting in India.',
    alternates: { canonical },
    openGraph: {
      title: 'Finance Planning Guides for India | CalcVerse',
      description:
        'Actionable long-tail finance guides with calculator links for loans, investing, tax, and monthly planning.',
      url: canonical,
      type: 'website',
    },
  };
}

const CLUSTER_LABELS = {
  loan: 'Loan and EMI Guides',
  investment: 'Investment and Returns Guides',
  tax: 'Tax and Salary Guides',
  planning: 'Budget and Decision Frameworks',
} as const;

export default function FinanceHubPage() {
  const canonical = getCanonicalUrl('/finance');
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Finance', url: '/finance' },
  ];

  const financeLinks = getFinanceGuideLinks();
  const loanGuides = getFinanceGuidesByCluster('loan');
  const investmentGuides = getFinanceGuidesByCluster('investment');
  const taxGuides = getFinanceGuidesByCluster('tax');
  const planningGuides = getFinanceGuidesByCluster('planning');

  const groups: Array<{ key: keyof typeof CLUSTER_LABELS; items: typeof FINANCE_GUIDES }> = [
    { key: 'loan', items: loanGuides },
    { key: 'investment', items: investmentGuides },
    { key: 'tax', items: taxGuides },
    { key: 'planning', items: planningGuides },
  ];

  return (
    <div className="calculator-container">
      <Schema
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Finance Planning Guides',
          description:
            'A collection of India-focused finance guides for loans, SIP, tax, salary, and monthly budget planning.',
          url: canonical,
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
        <h1>Finance Planning Guides for India</h1>
        <p>
          Use these high-intent guides to make better decisions on EMI, loan eligibility, SIP targets, tax planning,
          and monthly budget control.
        </p>
        <div className="blog-meta">
          <span className="chip">{FINANCE_GUIDES.length} Guides</span>
          <span className="chip">India-Focused</span>
          <span className="chip">Updated for 2026</span>
        </div>
      </section>

      <div className="summary-box">
        <strong>How to use this hub:</strong> open the guide closest to your decision, run the linked calculator,
        and compare at least two scenarios before acting.
      </div>

      <div className="card content-block">
        <h2>All Finance Guides</h2>
        <RelatedCalculators calculators={financeLinks} title="Open a Guide" />
      </div>

      {groups.map((group) => (
        <section key={group.key} className="card content-block">
          <h2>{CLUSTER_LABELS[group.key]}</h2>
          <div className="grid calculator-grid">
            {group.items.map((guide) => (
              <article key={guide.slug} className="card">
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
                <div className="calc-link-row">
                  <Link href={`/finance/${guide.slug}`} className="btn secondary">
                    Open Guide
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
