import Link from 'next/link';
import Schema from '@/app/components/Schema';
import FAQSection from '@/app/components/FAQSection';
import RelatedCalculators from '@/app/components/RelatedCalculators';
import { FAQItem } from '@/types';
import { getCanonicalUrl } from '@/lib/seo-utils';
import { getCalculatorById } from '@/lib/calculators';
import { getElectricityGuideLinks } from '@/lib/electricity-content';

interface ElectricityGuidePageProps {
  title: string;
  description: string;
  answer: string;
  bullets: string[];
  examples: Array<{
    title: string;
    text: string;
  }>;
  faqs: FAQItem[];
  canonicalPath: string;
  relatedCalculatorSlugs: string[];
  relatedGuideSlugs: string[];
}

export default function ElectricityGuidePage({
  title,
  description,
  answer,
  bullets,
  examples,
  faqs,
  canonicalPath,
  relatedCalculatorSlugs,
  relatedGuideSlugs,
}: ElectricityGuidePageProps) {
  const canonical = getCanonicalUrl(canonicalPath);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Electricity', url: '/electricity' },
    { name: title, url: canonicalPath },
  ];
  const calculators = relatedCalculatorSlugs
    .map(slug => getCalculatorById(slug))
    .filter((item): item is NonNullable<ReturnType<typeof getCalculatorById>> => Boolean(item));
  const guideLinks = getElectricityGuideLinks().filter(link => relatedGuideSlugs.includes(link.path.replace('/electricity/', '')));

  return (
    <div className="calculator-container">
      <Schema schema={{ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical, isPartOf: { '@type': 'WebSite', name: 'CalcVerse', url: 'https://calcverse.in' } }} />
      <Schema schema={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `https://calcverse.in${item.url}` })) }} />
      <Schema schema={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }} />

      <nav className="safe-private">
        {breadcrumbs.map((item, index) => (
          <span key={item.url}>
            {index > 0 && ' / '}
            {index < breadcrumbs.length - 1 ? <Link href={item.url}>{item.name}</Link> : item.name}
          </span>
        ))}
      </nav>

      <h1>{title}</h1>
      <p className="safe-private">{description}</p>

      <div className="card content-block">
        <h2>Quick Answer</h2>
        <p>{answer}</p>
      </div>

      <div className="card content-block">
        <h2>Key Points</h2>
        <ul>
          {bullets.map(bullet => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>

      <div className="card content-block">
        <h2>Examples</h2>
        {examples.map(example => (
          <div key={example.title} className="explanation-section">
            <h3>{example.title}</h3>
            <p>{example.text}</p>
          </div>
        ))}
      </div>

      <div className="card content-block">
        <FAQSection faqs={faqs} />
      </div>

      {calculators.length > 0 ? (
        <div className="card content-block">
          <RelatedCalculators calculators={calculators} title="Related Electricity Calculators" />
        </div>
      ) : null}

      {guideLinks.length > 0 ? (
        <div className="card content-block">
          <h2>Electricity Guides</h2>
          <div className="grid calculator-grid">
            {guideLinks.map(link => (
              <Link key={link.path} href={link.path} className="card">
                <h3>{link.name}</h3>
                <p>{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
