import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateElectricityTitle, generateElectricityMetaDescription, getCanonicalUrl, ELECTRICITY_PROVIDERS } from '@/lib/seo-utils';
import { ELECTRICITY_GUIDES, getElectricityProviderContent, getElectricityGuide } from '@/lib/electricity-content';
import ElectricityProviderPage from '@/app/electricity/_components/ElectricityProviderPage';
import ElectricityGuidePage from '@/app/electricity/_components/ElectricityGuidePage';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = ELECTRICITY_PROVIDERS.find(p => p.slug === slug);
  const guide = getElectricityGuide(slug);

  if (guide) {
    const title = `${guide.title} 2026 | CalcVerse`;
    const description = guide.description;
    const canonical = getCanonicalUrl(`/electricity/${slug}`);

    return {
      title,
      description,
      keywords: [
        guide.title.toLowerCase(),
        'electricity bill india',
        'electricity unit rate india',
        'electricity slab rate',
      ],
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        type: 'article',
      },
    };
  }

  if (!provider) {
    notFound();
  }

  const title = generateElectricityTitle(provider.name, provider.state, provider.slug);
  const description = generateElectricityMetaDescription(provider.name, provider.state, provider.slug);
  const canonical = getCanonicalUrl(`/electricity/${slug}`);

  return {
    title,
    description,
    keywords: [
      `${provider.name} electricity bill calculator`,
      `${provider.name} bill rate per unit`,
      `${provider.name} electricity rate`,
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
  const providerSlugs = ELECTRICITY_PROVIDERS.map(provider => provider.slug);
  const guideSlugs = ELECTRICITY_GUIDES.map(guide => guide.slug);

  return [...providerSlugs, ...guideSlugs].map(slug => ({ slug }));
}

export default async function ElectricityCalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = ELECTRICITY_PROVIDERS.find(p => p.slug === slug);
  const providerContent = getElectricityProviderContent(slug);
  const guide = getElectricityGuide(slug);

  if (guide) {
    return (
      <ElectricityGuidePage
        title={guide.title}
        description={guide.description}
        answer={guide.answer}
        bullets={guide.bullets}
        examples={guide.examples}
        faqs={guide.faqs}
        canonicalPath={`/electricity/${slug}`}
        relatedCalculatorSlugs={guide.relatedCalculatorSlugs}
        relatedGuideSlugs={guide.relatedGuideSlugs}
      />
    );
  }

  if (!provider || !providerContent) {
    notFound();
  }
  return <ElectricityProviderPage provider={providerContent} />;
}
