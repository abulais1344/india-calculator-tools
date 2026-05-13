import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Schema from '@/app/components/Schema';
import FAQSection from '@/app/components/FAQSection';
import RelatedCalculators from '@/app/components/RelatedCalculators';
import {
  parsePercentageUrlSlug,
  calculatePercentage,
  getGradeClassification,
  generatePercentageTitle,
  generatePercentageMetaDescription,
  generateFAQSchema,
  generateHowToSchema,
  generateBreadcrumbSchema,
  getCanonicalUrl,
} from '@/lib/seo-utils';
import { PERCENTAGE_FAQS } from '@/lib/faq-data';
import { getRelatedCalculators } from '@/lib/calculators';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parsePercentageUrlSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { obtained, total } = parsed;
  const percentage = calculatePercentage(obtained, total);

  const title = generatePercentageTitle(obtained, total, percentage, 'Exam Marks');
  const description = generatePercentageMetaDescription(obtained, total, percentage, 'exam marks');
  const canonical = getCanonicalUrl(`/percentage/${slug}`);

  return {
    title,
    description,
    keywords: [
      `${obtained} out of ${total}`,
      `${obtained}/${total}`,
      'percentage',
      'marks percentage',
      `${percentage}%`,
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: 'https://calcverse.in/images/og-image.png',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const commonPercentages = [
    { obtained: 438, total: 600 },
    { obtained: 380, total: 500 },
    { obtained: 438, total: 500 },
    { obtained: 320, total: 400 },
    { obtained: 300, total: 500 },
    { obtained: 250, total: 300 },
  ];

  return commonPercentages.map(({ obtained, total }) => ({
    slug: `${obtained}-out-of-${total}`,
  }));
}

export default async function PercentageCalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parsePercentageUrlSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { obtained, total } = parsed;
  const percentage = calculatePercentage(obtained, total);
  const { class: gradeClass, description: gradeDesc, isGood } = getGradeClassification(percentage);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Percentage Calculator', url: '/percentage-calculator.html' },
    { name: `${obtained} out of ${total}`, url: `/percentage/${slug}` },
  ];

  const faqSchema = generateFAQSchema(PERCENTAGE_FAQS);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const howToSchema = generateHowToSchema(
    `How to Calculate ${obtained} out of ${total} as Percentage`,
    `Learn how to calculate ${obtained} out of ${total} as a percentage with step-by-step formula`,
    [
      {
        name: 'Identify Values',
        text: `Obtained marks = ${obtained}, Total marks = ${total}`,
      },
      {
        name: 'Apply Formula',
        text: `Percentage = (Obtained / Total) × 100 = (${obtained} / ${total}) × 100`,
      },
      {
        name: 'Calculate',
        text: `${obtained} ÷ ${total} = ${(obtained / total).toFixed(4)}`,
      },
      {
        name: 'Multiply by 100',
        text: `${(obtained / total).toFixed(4)} × 100 = ${percentage}%`,
      },
    ]
  );

  const relatedCalcs = getRelatedCalculators('percentage-calc', 6);

  return (
    <div className="calculator-container">
      <Schema schema={faqSchema} />
      <Schema schema={breadcrumbSchema} />
      <Schema schema={howToSchema} />

      <nav className="safe-private">
        {breadcrumbs.map((item, idx) => (
          <span key={item.url}>
            {idx > 0 && ' / '}
            {idx < breadcrumbs.length - 1 ? <a href={item.url}>{item.name}</a> : item.name}
          </span>
        ))}
      </nav>

      <h1>
        {obtained} Out of {total} as Percentage
      </h1>
      <p className="safe-private">
        Calculate exact percentage from {obtained} out of {total}. Get formula, explanation, and grade
        analysis.
      </p>
      <p className="safe-private">Updated May 2026 • Free calculator • No signup required</p>

      <div className="result-box content-block">
        <div className="result-item">
          <span>Result</span>
          <span className="result-value">{percentage}%</span>
        </div>
        <div className="benefit-note">Is the percentage for {obtained} marks out of {total}</div>
        <div className="benefit-note">
          <span className={isGood ? 'interest-saved' : ''}>
            Grade: {gradeClass} ({gradeDesc})
          </span>
        </div>
      </div>

      <div className="card content-block">
        <h2>How to Calculate Percentage</h2>

        <div className="explanation-section">
          <h3>Step 1: Identify the Values</h3>
          <ul>
            <li>
              Marks Obtained: <strong>{obtained}</strong>
            </li>
            <li>
              Total Marks: <strong>{total}</strong>
            </li>
          </ul>
        </div>

        <div className="explanation-section">
          <h3>Step 2: Apply the Formula</h3>
          <p>
            <strong>Percentage = (Obtained Marks ÷ Total Marks) × 100</strong>
          </p>
        </div>

        <div className="explanation-section">
          <h3>Step 3: Substitute Values</h3>
          <p>
            Percentage = ({obtained} ÷ {total}) × 100
          </p>
        </div>

        <div className="explanation-section">
          <h3>Step 4: Calculate</h3>
          <p>
            Percentage = {(obtained / total).toFixed(4)} × 100 = <strong>{percentage}%</strong>
          </p>
        </div>
      </div>

      <div className="card content-block">
        <h2>Formula</h2>
        <p>
          <strong>Percentage = (Obtained Marks / Total Marks) × 100</strong>
        </p>

        <h3>Where:</h3>
        <ul>
          <li>
            <strong>Obtained Marks:</strong> The marks/score you received ({obtained})
          </li>
          <li>
            <strong>Total Marks:</strong> The maximum possible marks ({total})
          </li>
          <li>
            <strong>Percentage:</strong> The calculated percentage ({percentage}%)
          </li>
        </ul>
      </div>

      <div className="card content-block">
        <h2>Grade Analysis</h2>
        <p>
          Your percentage of <strong>{percentage}%</strong> falls in the <strong>{gradeClass}</strong> grade
          category:
        </p>
        <ul>
          <li>
            <strong>90% - 100%:</strong> A+ (Excellent)
          </li>
          <li>
            <strong>80% - 89%:</strong> A (Very Good)
          </li>
          <li>
            <strong>70% - 79%:</strong> B (Good)
          </li>
          <li>
            <strong>60% - 69%:</strong> C (Satisfactory)
          </li>
          <li>
            <strong>50% - 59%:</strong> D (Pass)
          </li>
          <li>
            <strong>Below 50%:</strong> F (Fail)
          </li>
        </ul>
      </div>

      <div className="card content-block">
        <h2>Try Similar Percentages</h2>
        <div className="grid calculator-grid">
          {[
            { obtained: obtained + 2, total },
            { obtained: obtained - 2, total },
            { obtained, total: total + 10 },
            { obtained: 438, total: 600 },
          ]
            .filter(
              calc =>
                calc.obtained > 0 &&
                calc.total > 0 &&
                calc.obtained <= calc.total &&
                !(calc.obtained === obtained && calc.total === total)
            )
            .map(calc => {
              const url = `/percentage/${calc.obtained}-out-of-${calc.total}`;
              const pct = calculatePercentage(calc.obtained, calc.total);

              return (
                <a key={url} href={url} className="card">
                  <h3>
                    {calc.obtained} out of {calc.total}
                  </h3>
                  <p>{pct}%</p>
                </a>
              );
            })}
        </div>
      </div>

      <div className="card content-block">
        <FAQSection faqs={PERCENTAGE_FAQS} />
      </div>

      <div className="card content-block">
        <RelatedCalculators calculators={relatedCalcs} title="Related Calculators" />
      </div>
    </div>
  );
}
