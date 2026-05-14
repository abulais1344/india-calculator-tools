import Link from 'next/link';
import Schema from '@/app/components/Schema';
import FAQSection from '@/app/components/FAQSection';
import RelatedCalculators from '@/app/components/RelatedCalculators';
import { Calculator } from '@/types';
import { getElectricityProviderFaqs, getElectricityGuideLinks, getElectricityProviderContent } from '@/lib/electricity-content';
import { getCanonicalUrl } from '@/lib/seo-utils';
import { getCalculatorById } from '@/lib/calculators';
import ProviderBillCalculator from '@/app/electricity/_components/ProviderBillCalculator';

interface ElectricityProviderPageProps {
  provider: NonNullable<ReturnType<typeof getElectricityProviderContent>>;
}

export default function ElectricityProviderPage({ provider }: ElectricityProviderPageProps) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Electricity', url: '/electricity' },
    { name: provider.name, url: `/electricity/${provider.slug}` },
  ];
  const canonical = getCanonicalUrl(`/electricity/${provider.slug}`);
  const faqs = getElectricityProviderFaqs(provider.name, provider.state);
  const calculatorLinks: Calculator[] = [
    getCalculatorById('electricity-bill'),
    ...provider.relatedProviderSlugs.map(slug => getCalculatorById(`electricity-${slug}`)),
  ].filter((item): item is Calculator => Boolean(item));
  const guideLinks = getElectricityGuideLinks().filter(link => provider.guideSlugs.includes(link.path.replace('/electricity/', '')));
  const relatedProviders = provider.relatedProviderSlugs
    .map(slug => getElectricityProviderContent(slug))
    .filter((item): item is NonNullable<ReturnType<typeof getElectricityProviderContent>> => Boolean(item));

  return (
    <div className="calculator-container">
      <Schema schema={{ '@context': 'https://schema.org', '@type': 'WebPage', name: `${provider.name} Electricity Bill Calculator`, description: `${provider.name} electricity bill calculator for ${provider.state}.`, url: canonical, isPartOf: { '@type': 'WebSite', name: 'CalcVerse', url: 'https://calcverse.in' } }} />
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

      <h1>
        {provider.name} Electricity Bill Calculator 2026 - {provider.state}
      </h1>
      <p className="safe-private">{provider.intro}</p>
      <p className="safe-private">{provider.latestRateNote} Updated May 2026 • Free calculator • No signup required</p>

      <div className="card content-block">
        <h2>Provider Overview</h2>
        <p>
          <strong>Provider:</strong> {provider.name}
        </p>
        <p>
          <strong>State/Region:</strong> {provider.state} ({provider.region})
        </p>
        <p>{provider.summary}</p>
      </div>

      <div className="card content-block">
        <h2>Unit Rate Table</h2>
        <div className="table-wrap">
          <table className="amortization-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Approximate Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Domestic</td>
                <td>Rs {provider.unitRate.toFixed(2)}/kWh</td>
              </tr>
              <tr>
                <td>Commercial</td>
                <td>Rs {(provider.unitRate * 1.5).toFixed(2)}/kWh</td>
              </tr>
              <tr>
                <td>Industrial</td>
                <td>Rs {(provider.unitRate * 1.2).toFixed(2)}/kWh</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="safe-private">Use the domestic rate as a quick estimate. Final billing may differ based on official slabs and surcharges.</p>
      </div>

      <div className="card content-block">
        <h2>Slab Explanation</h2>
        <ul>
          <li>Lower monthly usage usually stays in a cheaper slab band.</li>
          <li>Once consumption crosses the next slab, the effective average cost rises.</li>
          <li>Fixed charges remain even when usage is low, so the bill does not fall in a straight line.</li>
          <li>Commercial and industrial consumers can have different rate bands from domestic users.</li>
        </ul>
      </div>

      <div className="card content-block">
        <h2>Interactive Bill Calculator</h2>
        <ProviderBillCalculator providerName={provider.name} baseUnitRate={provider.unitRate} />
      </div>

      <div className="card content-block">
        <h2>Example Calculation</h2>
        <ul>
          <li>100 units x Rs {provider.unitRate.toFixed(2)} = Rs {(100 * provider.unitRate).toFixed(0)} energy charge</li>
          <li>Fixed charges add to the bill even if usage stays low</li>
          <li>Taxes and provider charges can move the final estimate upward</li>
          <li>Use the calculator to compare a low-usage and high-usage month side by side</li>
        </ul>
      </div>

      <div className="card content-block">
        <h2>Last Updated</h2>
        <p>Updated May 2026 with provider-level billing copy and internal linking.</p>
      </div>

      <div className="card content-block">
        <FAQSection faqs={faqs} />
      </div>

      {calculatorLinks.length > 0 ? (
        <div className="card content-block">
          <RelatedCalculators calculators={calculatorLinks} title="Related Electricity Calculators" />
        </div>
      ) : null}

      {guideLinks.length > 0 ? (
        <div className="card content-block">
          <h2>Related Electricity Guides</h2>
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

      {relatedProviders.length > 0 ? (
        <div className="card content-block">
          <h2>People Also Search For</h2>
          <div className="grid calculator-grid">
            {relatedProviders.map(related => (
              <Link key={related.slug} href={`/electricity/${related.slug}`} className="card">
                <h3>{related.name}</h3>
                <p>{related.state}</p>
                <p>Rs {related.unitRate.toFixed(2)}/kWh</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
