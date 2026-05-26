import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Schema from '@/app/components/Schema';
import FAQSection from '@/app/components/FAQSection';
import RelatedCalculators from '@/app/components/RelatedCalculators';
import { getCanonicalUrl } from '@/lib/seo-utils';
import { getCalculatorById } from '@/lib/calculators';
import { FINANCE_GUIDES, getFinanceGuide } from '@/lib/finance-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getFinanceGuide(slug);

  if (!guide) {
    notFound();
  }

  const canonical = getCanonicalUrl(`/finance/${slug}`);

  return {
    title: `${guide.title} 2026 | CalcVerse`,
    description: guide.description,
    alternates: { canonical },
    openGraph: {
      title: `${guide.title} | CalcVerse`,
      description: guide.description,
      url: canonical,
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  return FINANCE_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export default async function FinanceGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getFinanceGuide(slug);

  if (!guide) {
    notFound();
  }

  const relatedCalculators = guide.relatedCalculatorIds
    .map((id) => getCalculatorById(id))
    .filter((item): item is NonNullable<ReturnType<typeof getCalculatorById>> => Boolean(item));

  const relatedGuides = guide.relatedGuideSlugs
    .map((relatedSlug) => getFinanceGuide(relatedSlug))
    .filter((item): item is NonNullable<ReturnType<typeof getFinanceGuide>> => Boolean(item));

  const canonical = getCanonicalUrl(`/finance/${slug}`);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Finance', url: '/finance' },
    { name: guide.title, url: `/finance/${slug}` },
  ];

  return (
    <div className="calculator-container">
      <Schema
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.title,
          description: guide.description,
          mainEntityOfPage: canonical,
          dateModified: new Date().toISOString().slice(0, 10),
          author: {
            '@type': 'Organization',
            name: 'CalcVerse',
          },
          publisher: {
            '@type': 'Organization',
            name: 'CalcVerse',
          },
        }}
      />
      <Schema
        schema={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faqs.map((faq) => ({
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
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
      </section>

      <div className="summary-box">
        <strong>Quick answer:</strong> {guide.answer}
      </div>

      <section className="card content-block">
        <h2>Key Points</h2>
        <ul>
          {guide.bullets.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      {relatedCalculators.length > 0 ? (
        <section className="card content-block">
          <RelatedCalculators calculators={relatedCalculators} title="Useful Calculators" />
        </section>
      ) : null}

      {relatedGuides.length > 0 ? (
        <section className="card content-block">
          <h2>Related Finance Guides</h2>
          <div className="grid calculator-grid">
            {relatedGuides.map((relatedGuide) => (
              <article key={relatedGuide.slug} className="card">
                <h3>{relatedGuide.title}</h3>
                <p>{relatedGuide.description}</p>
                <div className="calc-link-row">
                  <Link href={`/finance/${relatedGuide.slug}`} className="btn secondary">
                    Open Guide
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="card content-block">
        <FAQSection faqs={guide.faqs} />
      </section>
    </div>
  );
}
