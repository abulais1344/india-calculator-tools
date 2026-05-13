import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateElectricityTitle, generateElectricityMetaDescription, getCanonicalUrl, ELECTRICITY_PROVIDERS } from '@/lib/seo-utils';
import { getElectricityProviderContent } from '@/lib/electricity-content';
import ElectricityProviderPage from '@/app/electricity/_components/ElectricityProviderPage';

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
  const providerContent = getElectricityProviderContent(slug);

  if (!provider || !providerContent) {
    notFound();
  }
  return <ElectricityProviderPage provider={providerContent} />;
}
