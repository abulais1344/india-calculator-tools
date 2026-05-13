import type { Metadata } from 'next';
import ElectricityGuidePage from '@/app/electricity/_components/ElectricityGuidePage';
import { getCanonicalUrl } from '@/lib/seo-utils';
import { getElectricityGuide } from '@/lib/electricity-content';

export async function generateMetadata(): Promise<Metadata> {
  const guide = getElectricityGuide('1-unit-electricity-cost-india');
  const title = `${guide?.title} | CalcVerse`;
  const description = guide?.description || '';
  const canonical = getCanonicalUrl('/electricity/1-unit-electricity-cost-india');

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'article' },
  };
}

export default function Page() {
  const guide = getElectricityGuide('1-unit-electricity-cost-india');
  if (!guide) return null;

  return (
    <ElectricityGuidePage
      title={guide.title}
      description={guide.description}
      answer={guide.answer}
      bullets={guide.bullets}
      examples={guide.examples}
      faqs={guide.faqs}
      canonicalPath="/electricity/1-unit-electricity-cost-india"
      relatedCalculatorSlugs={guide.relatedCalculatorSlugs}
      relatedGuideSlugs={guide.relatedGuideSlugs}
    />
  );
}
