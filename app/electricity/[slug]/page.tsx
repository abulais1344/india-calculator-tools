import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Schema from '@/app/components/Schema';
import FAQSection from '@/app/components/FAQSection';
import RelatedCalculators from '@/app/components/RelatedCalculators';
import {
  generateElectricityTitle,
  generateElectricityMetaDescription,
  generateFAQSchema,
  generateBreadcrumbSchema,
  getCanonicalUrl,
  ELECTRICITY_PROVIDERS,
} from '@/lib/seo-utils';
import { ELECTRICITY_FAQS } from '@/lib/faq-data';
import { getRelatedCalculators } from '@/lib/calculators';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = ELECTRICITY_PROVIDERS.find(p => p.slug === slug);

  if (!provider) {
    notFound();
  }

  const title = generateElectricityTitle(provider.name, provider.state);
  const description = generateElectricityMetaDescription(provider.name, provider.state);
  const canonical = getCanonicalUrl(`/electricity/${slug}`);

  return {
    title,
    description,
    keywords: [
      `${provider.name} electricity bill calculator`,
      `${provider.state} electricity bill`,
      'electricity calculator',
      'unit rate',
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return ELECTRICITY_PROVIDERS.map(provider => ({
    slug: provider.slug,
  }));
}

export default async function ElectricityCalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = ELECTRICITY_PROVIDERS.find(p => p.slug === slug);

  if (!provider) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Electricity Bill Calculator', url: '/electricity-bill-calculator.html' },
    { name: provider.name, url: `/electricity/${slug}` },
  ];

  const electricityFAQs = ELECTRICITY_FAQS.map(faq => ({
    ...faq,
    question: faq.question.replace('electricity', `${provider.name} electricity`),
  }));

  const faqSchema = generateFAQSchema(electricityFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const relatedCalcs = getRelatedCalculators('electricity', 6);

  return (
    <div className="calculator-container">
      <Schema schema={faqSchema} />
      <Schema schema={breadcrumbSchema} />

      <nav className="safe-private">
        {breadcrumbs.map((item, idx) => (
          <span key={item.url}>
            {idx > 0 && ' / '}
            {idx < breadcrumbs.length - 1 ? <a href={item.url}>{item.name}</a> : item.name}
          </span>
        ))}
      </nav>

      <h1>
        {provider.name} Electricity Bill Calculator - {provider.state}
      </h1>
      <p className="safe-private">
        Calculate your {provider.name} electricity bill instantly using current unit rates for{' '}
        {provider.state}. Get billing breakdown and cost analysis.
      </p>
      <p className="safe-private">Updated May 2026 • Free calculator • No signup required</p>

      <div className="card content-block">
        <h2>About {provider.name}</h2>
        <p>
          <strong>Provider:</strong> {provider.name}
        </p>
        <p>
          <strong>State:</strong> {provider.state}
        </p>
        <p>
          <strong>Current Unit Rate (Domestic):</strong> ₹{provider.unitRate}/kWh
        </p>
      </div>

      <div className="card content-block">
        <h2>Calculate Your Bill</h2>
        <div className="explanation-section">
          <div className="field">
            <label>Units Consumed (kWh):</label>
            <input type="number" placeholder="Enter units" />
          </div>

          <div className="field">
            <label>Category:</label>
            <select>
              <option>Domestic</option>
              <option>Commercial</option>
              <option>Industrial</option>
            </select>
          </div>

          <button>Calculate Bill</button>
        </div>
      </div>

      <div className="card content-block">
        <h2>Unit Rate Structure</h2>
        <div className="table-wrap">
          <table className="amortization-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Rate (₹/kWh)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Domestic</td>
                <td>₹{provider.unitRate}/kWh</td>
              </tr>
              <tr>
                <td>Commercial</td>
                <td>₹{(provider.unitRate * 1.5).toFixed(2)}/kWh</td>
              </tr>
              <tr>
                <td>Industrial</td>
                <td>₹{(provider.unitRate * 1.2).toFixed(2)}/kWh</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="safe-private">
          * Rates are approximate and may vary. Please check with {provider.name} for official rates.
        </p>
      </div>

      <div className="card content-block">
        <h2>How Your Bill is Calculated</h2>
        <div className="explanation-section">
          <h3>Formula:</h3>
          <p>
            <strong>Total Bill = (Units × Unit Rate) + Fixed Charges + Taxes</strong>
          </p>
        </div>

        <div className="explanation-section">
          <h3>Example Calculation (100 units):</h3>
          <ul>
            <li>Units Consumed: 100 kWh</li>
            <li>Charge (100 × ₹{provider.unitRate}): ₹{(100 * provider.unitRate).toFixed(0)}</li>
            <li>Fixed Charges: ~₹50</li>
            <li>Taxes (GST ~5%): ~₹{((100 * provider.unitRate + 50) * 0.05).toFixed(0)}</li>
            <li>
              <strong>
                Total: ~₹
                {(100 * provider.unitRate + 50 + (100 * provider.unitRate + 50) * 0.05).toFixed(0)}
              </strong>
            </li>
          </ul>
        </div>
      </div>

      <div className="card content-block">
        <h2>Tips to Reduce Your Electricity Bill</h2>
        <div className="grid calculator-grid">
          <div className="card">
            <h3>Use LED Bulbs</h3>
            <p>LED bulbs use 75% less energy than incandescent bulbs.</p>
          </div>
          <div className="card">
            <h3>AC Maintenance</h3>
            <p>Regular AC servicing improves efficiency and reduces consumption.</p>
          </div>
          <div className="card">
            <h3>Use Fans</h3>
            <p>Fans use 50x less energy than air conditioners.</p>
          </div>
          <div className="card">
            <h3>Avoid Peak Hours</h3>
            <p>Some areas offer lower rates during off-peak hours.</p>
          </div>
        </div>
      </div>

      <div className="card content-block">
        <FAQSection faqs={electricityFAQs} />
      </div>

      <div className="card content-block">
        <RelatedCalculators calculators={relatedCalcs} title="Related Calculators" />
      </div>

      <div className="card content-block">
        <h2>Other State Electricity Providers</h2>
        <div className="grid calculator-grid">
          {ELECTRICITY_PROVIDERS.filter(p => p.slug !== slug)
            .slice(0, 6)
            .map(p => (
              <a key={p.slug} href={`/electricity/${p.slug}`} className="card">
                <h3>{p.name}</h3>
                <p>{p.state}</p>
                <p>₹{p.unitRate}/kWh</p>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
