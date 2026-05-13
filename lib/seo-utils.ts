import { FAQItem, FAQSchema } from '@/types';

/**
 * Generate FAQ Schema (JSON-LD) for structured data
 */
export function generateFAQSchema(faqs: FAQItem[]): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://calcverse.in${item.url}`,
    })),
  };
}

/**
 * Generate How-To Schema for calculation steps
 */
export function generateHowToSchema(
  title: string,
  description: string,
  steps: { name: string; text: string }[],
  image?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    image,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * Generate meta description optimized for CTR
 * Includes natural query inclusion and benefit statement
 */
export function generatePercentageMetaDescription(
  obtained: number,
  total: number,
  percentage: number,
  category?: string
): string {
  const categoryText = category ? ` for ${category.toLowerCase()}` : '';
  return `${obtained} out of ${total} = ${percentage}%${categoryText}. Free calculator with formula, grade analysis, and step-by-step method. Updated 2026.`;
}

/**
 * Generate electricity bill calculator meta description
 */
export function generateElectricityMetaDescription(
  provider: string,
  state: string
): string {
  return `${provider} electricity bill calculator for ${state}. Estimate units, slab rates, fixed charges, and taxes with a free 2026 bill estimator.`;
}

/**
 * Optimize title for SEO and CTR
 */
export function generatePercentageTitle(
  obtained: number,
  total: number,
  percentage: number,
  category?: string
): string {
  const suffix = category ? ` (${category})` : '';
  return `${obtained} out of ${total} as Percentage = ${percentage}%${suffix} | CalcVerse`;
}

export function generateElectricityTitle(provider: string, state: string): string {
  return `${provider} Electricity Bill Calculator 2026 | ${state} Unit Rate & Bill Estimator | CalcVerse`;
}

/**
 * Get related calculators for internal linking
 */
export const RELATED_CALCULATORS = {
  percentage: [
    { name: 'Marks Percentage Calculator', path: '/marks-percentage-calculator.html' },
    { name: 'Percentage Calculator', path: '/percentage-calculator.html' },
    { name: 'HSC Percentage Calculator', path: '/hsc-percentage-calculator.html' },
    { name: 'SSC Percentage Calculator', path: '/ssc-percentage-calculator.html' },
    { name: 'CBSE Best of 5 Calculator', path: '/cbse-best-of-5-calculator.html' },
  ],
  electricity: [
    { name: 'Electricity Bill Calculator', path: '/electricity-bill-calculator.html' },
    { name: 'Fuel Cost Calculator', path: '/fuel-cost-calculator.html' },
    { name: 'GST Calculator', path: '/gst-calculator.html' },
    { name: 'EMI Calculator', path: '/emi-calculator.html' },
  ],
};

/**
 * Canonical URL builder
 */
export function getCanonicalUrl(path: string): string {
  return `https://calcverse.in${path}`;
}

/**
 * Generate Open Graph metadata
 */
export function generateOGMetadata(
  title: string,
  description: string,
  path: string,
  image?: string
) {
  return {
    title,
    description,
    url: getCanonicalUrl(path),
    type: 'website',
    image: image || 'https://calcverse.in/images/og-image.png',
  };
}

/**
 * Validation and sanitization
 */
export function validatePercentageInput(obtained: number, total: number): boolean {
  return (
    typeof obtained === 'number' &&
    typeof total === 'number' &&
    obtained >= 0 &&
    total > 0 &&
    obtained <= total &&
    obtained <= 1000000 &&
    total <= 1000000
  );
}

export function calculatePercentage(obtained: number, total: number): number {
  if (!validatePercentageInput(obtained, total)) return 0;
  return Math.round((obtained / total) * 100 * 100) / 100; // Two decimals
}

/**
 * Grade classification for Indian education system
 */
export function getGradeClassification(percentage: number): {
  class: string;
  description: string;
  isGood: boolean;
} {
  if (percentage >= 90) return { class: 'A+', description: 'Excellent', isGood: true };
  if (percentage >= 80) return { class: 'A', description: 'Very Good', isGood: true };
  if (percentage >= 70) return { class: 'B', description: 'Good', isGood: true };
  if (percentage >= 60) return { class: 'C', description: 'Satisfactory', isGood: false };
  if (percentage >= 50) return { class: 'D', description: 'Pass', isGood: false };
  return { class: 'F', description: 'Fail', isGood: false };
}

/**
 * Extract numbers from URL path
 * e.g., "438-out-of-600" => { obtained: 438, total: 600 }
 */
export function parsePercentageUrlSlug(slug: string): { obtained: number; total: number } | null {
  const pattern = /^(\d+)-out-of-(\d+)$/;
  const match = slug.match(pattern);

  if (!match) return null;

  const obtained = parseInt(match[1], 10);
  const total = parseInt(match[2], 10);

  if (validatePercentageInput(obtained, total)) {
    return { obtained, total };
  }

  return null;
}

/**
 * Generate URL slug from numbers
 * e.g., { obtained: 438, total: 600 } => "438-out-of-600"
 */
export function generatePercentageUrlSlug(obtained: number, total: number): string {
  if (!validatePercentageInput(obtained, total)) {
    throw new Error('Invalid percentage input');
  }
  return `${obtained}-out-of-${total}`;
}

/**
 * Get all electricity providers for sitemap
 */
export const ELECTRICITY_PROVIDERS: Array<{
  id: string;
  name: string;
  state: string;
  slug: string;
  unitRate: number;
}> = [
  { id: 'jusco', name: 'JUSCO', state: 'Jharkhand', slug: 'jusco-bill-calculator', unitRate: 7.5 },
  { id: 'msedcl', name: 'MSEDCL', state: 'Maharashtra', slug: 'msedcl-bill-calculator', unitRate: 8.2 },
  { id: 'bescom', name: 'BESCOM', state: 'Karnataka', slug: 'bescom-bill-calculator', unitRate: 8.9 },
  { id: 'kseb', name: 'KSEB', state: 'Kerala', slug: 'kseb-bill-calculator', unitRate: 6.5 },
  { id: 'tpddl', name: 'TPDDL', state: 'Delhi', slug: 'tpddl-bill-calculator', unitRate: 8.4 },
  { id: 'bses-rajdhani', name: 'BSES Rajdhani', state: 'Delhi', slug: 'bses-rajdhani-bill-calculator', unitRate: 8.0 },
  { id: 'wesco', name: 'WESCO', state: 'Odisha', slug: 'wesco-bill-calculator', unitRate: 7.2 },
  { id: 'tangedco', name: 'TANGEDCO', state: 'Tamil Nadu', slug: 'tangedco-bill-calculator', unitRate: 8.5 },
  { id: 'tneb', name: 'TNEB', state: 'Tamil Nadu', slug: 'tneb-bill-calculator', unitRate: 8.6 },
  { id: 'wbsedcl', name: 'WBSEDCL', state: 'West Bengal', slug: 'wbsedcl-bill-calculator', unitRate: 6.9 },
];
