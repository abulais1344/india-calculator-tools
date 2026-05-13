import { Calculator, FAQItem } from '@/types';
import { CALCULATORS } from '@/lib/calculators';
import { ELECTRICITY_PROVIDERS } from '@/lib/seo-utils';

export interface ElectricityProviderContent {
  slug: string;
  name: string;
  state: string;
  region: string;
  summary: string;
  intro: string;
  guideSlugs: string[];
  relatedProviderSlugs: string[];
  latestRateNote: string;
}

export interface ElectricityGuideContent {
  slug: string;
  title: string;
  description: string;
  answer: string;
  bullets: string[];
  examples: Array<{
    title: string;
    text: string;
  }>;
  faqs: FAQItem[];
  relatedCalculatorSlugs: string[];
  relatedGuideSlugs: string[];
}

export const ELECTRICITY_PROVIDER_CONTENT: ElectricityProviderContent[] = [
  {
    slug: 'jusco-bill-calculator',
    name: 'JUSCO',
    state: 'Jharkhand',
    region: 'East India',
    summary: 'Popular for Jamshedpur users who want to estimate domestic bills quickly with current slab guidance.',
    intro: 'JUSCO users can estimate monthly bills by combining units consumed, slab-based rates, fixed charges, and taxes.',
    guideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', 'fixed-charge-vs-energy-charge'],
    relatedProviderSlugs: ['wbsedcl-bill-calculator', 'wesco-bill-calculator', 'tneb-bill-calculator'],
    latestRateNote: 'Approximate domestic rate updated for 2026 planning.',
  },
  {
    slug: 'msedcl-bill-calculator',
    name: 'MSEDCL',
    state: 'Maharashtra',
    region: 'West India',
    summary: 'Useful for Maharashtra households comparing monthly usage against slab changes and fixed charges.',
    intro: 'MSEDCL bills are easiest to estimate when you split energy charges, fixed charges, and tax into separate steps.',
    guideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', '1-unit-electricity-cost-india'],
    relatedProviderSlugs: ['tneb-bill-calculator', 'bescom-bill-calculator', 'tpddl-bill-calculator'],
    latestRateNote: 'Approximate domestic rate updated for 2026 planning.',
  },
  {
    slug: 'bescom-bill-calculator',
    name: 'BESCOM',
    state: 'Karnataka',
    region: 'South India',
    summary: 'Ideal for Karnataka users checking slab-wise energy charges, fixed charges, and bill movement across months.',
    intro: 'BESCOM users should first identify the slab range, then add fixed charges and tax to get a realistic bill estimate.',
    guideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', 'fixed-charge-vs-energy-charge'],
    relatedProviderSlugs: ['kseb-bill-calculator', 'tangedco-bill-calculator', 'tneb-bill-calculator'],
    latestRateNote: 'Approximate domestic rate updated for 2026 planning.',
  },
  {
    slug: 'kseb-bill-calculator',
    name: 'KSEB',
    state: 'Kerala',
    region: 'South India',
    summary: 'Helps Kerala households estimate monthly electricity bills and understand why higher slabs push the average rate up.',
    intro: 'KSEB bills are easiest to read when you separate the rate per unit from the rest of the bill structure.',
    guideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', '1-unit-electricity-cost-india'],
    relatedProviderSlugs: ['bescom-bill-calculator', 'tangedco-bill-calculator', 'tneb-bill-calculator'],
    latestRateNote: 'Approximate domestic rate updated for 2026 planning.',
  },
  {
    slug: 'tpddl-bill-calculator',
    name: 'TPDDL',
    state: 'Delhi',
    region: 'North India',
    summary: 'Helpful for Delhi users checking monthly electricity usage, slab jumps, and approximate domestic billing.',
    intro: 'TPDDL bills are best estimated by comparing your current units with the rate slab you are likely to hit.',
    guideSlugs: ['how-electricity-bill-is-calculated', 'fixed-charge-vs-energy-charge', '1-unit-electricity-cost-india'],
    relatedProviderSlugs: ['bses-rajdhani-bill-calculator', 'msedcl-bill-calculator', 'wbsedcl-bill-calculator'],
    latestRateNote: 'Approximate domestic rate updated for 2026 planning.',
  },
  {
    slug: 'bses-rajdhani-bill-calculator',
    name: 'BSES Rajdhani',
    state: 'Delhi',
    region: 'North India',
    summary: 'Useful for Delhi residents comparing estimated bills against slab changes and fixed charges.',
    intro: 'BSES Rajdhani bills can be estimated accurately once you know the consumed units and the effective unit rate.',
    guideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', 'fixed-charge-vs-energy-charge'],
    relatedProviderSlugs: ['tpddl-bill-calculator', 'msedcl-bill-calculator', 'wbsedcl-bill-calculator'],
    latestRateNote: 'Approximate domestic rate updated for 2026 planning.',
  },
  {
    slug: 'wesco-bill-calculator',
    name: 'WESCO',
    state: 'Odisha',
    region: 'East India',
    summary: 'Helpful for Odisha users comparing domestic usage with realistic slab-based electricity bill estimates.',
    intro: 'WESCO users can estimate bills by isolating energy charges first and then adding fixed charges and tax.',
    guideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', '1-unit-electricity-cost-india'],
    relatedProviderSlugs: ['wbsedcl-bill-calculator', 'jusco-bill-calculator', 'tneb-bill-calculator'],
    latestRateNote: 'Approximate domestic rate updated for 2026 planning.',
  },
  {
    slug: 'tangedco-bill-calculator',
    name: 'TANGEDCO',
    state: 'Tamil Nadu',
    region: 'South India',
    summary: 'Good for Tamil Nadu users who want a fast estimate before the official bill arrives.',
    intro: 'TANGEDCO estimates become clearer when you compare slab rate, fixed charge, and total units separately.',
    guideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', 'fixed-charge-vs-energy-charge'],
    relatedProviderSlugs: ['tneb-bill-calculator', 'bescom-bill-calculator', 'kseb-bill-calculator'],
    latestRateNote: 'Approximate domestic rate updated for 2026 planning.',
  },
  {
    slug: 'tneb-bill-calculator',
    name: 'TNEB',
    state: 'Tamil Nadu',
    region: 'South India',
    summary: 'Useful for Tamil Nadu households tracking monthly usage, slab transitions, and effective per-unit cost.',
    intro: 'TNEB bills are easiest to estimate by converting units into energy charges first, then adding fixed charges.',
    guideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', '1-unit-electricity-cost-india'],
    relatedProviderSlugs: ['tangedco-bill-calculator', 'bescom-bill-calculator', 'kseb-bill-calculator'],
    latestRateNote: 'Approximate domestic rate updated for 2026 planning.',
  },
  {
    slug: 'wbsedcl-bill-calculator',
    name: 'WBSEDCL',
    state: 'West Bengal',
    region: 'East India',
    summary: 'Best for West Bengal households comparing billed units against expected slab-wise domestic charges.',
    intro: 'WBSEDCL estimates work best when you line up the slab, fixed charge, and taxes against the month’s usage.',
    guideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', 'fixed-charge-vs-energy-charge'],
    relatedProviderSlugs: ['jusco-bill-calculator', 'wesco-bill-calculator', 'tpddl-bill-calculator'],
    latestRateNote: 'Approximate domestic rate updated for 2026 planning.',
  },
];

export const ELECTRICITY_PROVIDER_GROUPS = [
  {
    title: 'East India',
    description: 'Provider pages for Jharkhand, Odisha, and West Bengal users.',
    providerSlugs: ['jusco-bill-calculator', 'wesco-bill-calculator', 'wbsedcl-bill-calculator'],
  },
  {
    title: 'North India',
    description: 'Delhi-focused electricity calculator pages.',
    providerSlugs: ['tpddl-bill-calculator', 'bses-rajdhani-bill-calculator'],
  },
  {
    title: 'South India',
    description: 'Popular calculators for Karnataka, Kerala, and Tamil Nadu.',
    providerSlugs: ['bescom-bill-calculator', 'kseb-bill-calculator', 'tangedco-bill-calculator', 'tneb-bill-calculator'],
  },
  {
    title: 'West India',
    description: 'Maharashtra electricity estimation with slab and fixed-charge context.',
    providerSlugs: ['msedcl-bill-calculator'],
  },
];

export const ELECTRICITY_HUB_FAQS: FAQItem[] = [
  {
    question: 'How do I calculate my electricity bill by units?',
    answer: 'Multiply your units by the applicable slab rate, add fixed charges, then add taxes and any provider-specific charges.',
  },
  {
    question: 'Why does my effective bill rate increase in higher slabs?',
    answer: 'Many utilities use slab pricing, so once your monthly units cross a threshold, the extra units are billed at a higher rate.',
  },
  {
    question: 'Can I estimate electricity bills before the final meter reading?',
    answer: 'Yes. A bill estimator gives a practical monthly approximation using your current usage pattern and the latest slab context.',
  },
  {
    question: 'Are the provider pages updated for 2026?',
    answer: 'Yes. The electricity pages are written for 2026-style planning and are intended for quick estimation, not official billing.',
  },
];

export const ELECTRICITY_GUIDES: ElectricityGuideContent[] = [
  {
    slug: 'how-electricity-bill-is-calculated',
    title: 'How Electricity Bill Is Calculated',
    description: 'Concise explanation of the bill formula with examples and calculator links.',
    answer: 'Electricity bills are usually calculated from units consumed, slab rate, fixed charge, taxes, and any state-specific adjustments.',
    bullets: [
      'Read the meter and note total units consumed for the billing period.',
      'Apply the correct slab rate for your domestic or commercial category.',
      'Add fixed charges, meter rent, taxes, and other utility-specific charges.',
      'Compare the final figure with a calculator before the bill arrives.',
    ],
    examples: [
      { title: 'Small usage example', text: 'If you use 120 units, your bill is the energy charge for 120 units plus fixed charges and taxes.' },
      { title: 'Higher usage example', text: 'If you use 380 units, slab-wise pricing can lift the average unit cost even if the base rate looks stable.' },
    ],
    faqs: [
      { question: 'What is the formula for electricity bill calculation?', answer: 'Bill = Units consumed x slab rate + fixed charges + taxes.' },
      { question: 'Why should I use a calculator before paying?', answer: 'A calculator helps you verify the likely bill amount and understand where the cost is coming from.' },
      { question: 'Does this work for all Indian states?', answer: 'Yes, the formula is broadly the same, but the rate slabs and charges differ by provider and region.' },
    ],
    relatedCalculatorSlugs: ['electricity-bill', 'electricity-jusco', 'electricity-msedcl', 'electricity-tneb'],
    relatedGuideSlugs: ['electricity-slab-rate-explained', 'fixed-charge-vs-energy-charge', '1-unit-electricity-cost-india'],
  },
  {
    slug: 'electricity-slab-rate-explained',
    title: 'Electricity Slab Rate Explained',
    description: 'Learn how slab pricing changes the effective rate per unit.',
    answer: 'A slab rate means different unit ranges are billed at different prices, so the average cost per unit can rise as consumption increases.',
    bullets: [
      'Lower slabs usually cover essential domestic usage at a lower rate.',
      'Once you cross a slab threshold, extra units are billed at the next rate band.',
      'Commercial and industrial categories often have separate slab logic.',
      'Your final bill can look higher even if the base rate appears unchanged.',
    ],
    examples: [
      { title: 'Low slab example', text: 'A 90-unit month may stay in the first slab and keep the average bill lower.' },
      { title: 'Crossing a slab', text: 'A 220-unit month may push part of the usage into a higher slab, increasing the average cost.' },
    ],
    faqs: [
      { question: 'What is a slab in electricity billing?', answer: 'A slab is a consumption band that applies a specific unit rate to that range of usage.' },
      { question: 'Do all providers use slabs?', answer: 'Most domestic electricity tariffs in India use slab-based pricing in some form.' },
      { question: 'How do I know my slab?', answer: 'Check your official utility tariff chart or use a provider-specific bill calculator.' },
    ],
    relatedCalculatorSlugs: ['electricity-bill', 'electricity-bescom', 'electricity-tneb', 'electricity-wbsedcl'],
    relatedGuideSlugs: ['how-electricity-bill-is-calculated', 'fixed-charge-vs-energy-charge', '1-unit-electricity-cost-india'],
  },
  {
    slug: '1-unit-electricity-cost-india',
    title: '1 Unit Electricity Cost in India',
    description: 'Understand what one unit means and how the cost changes by provider and slab.',
    answer: 'One unit of electricity equals 1 kWh, but the rupee cost of that unit changes by state, provider, slab, and consumer category.',
    bullets: [
      '1 unit = 1 kilowatt-hour, which is the standard billing measure.',
      'The first few units can be cheaper than later units because of slab pricing.',
      'The effective per-unit cost is often higher than the headline rate after charges.',
      'Use a calculator to estimate your real monthly cost per unit.',
    ],
    examples: [
      { title: 'Simple explanation', text: 'If your bill is Rs 900 for 100 units, your effective cost is Rs 9 per unit before any future month variation.' },
      { title: 'Why the average changes', text: 'If fixed charges stay the same but consumption drops, the effective unit cost can rise on a per-unit basis.' },
    ],
    faqs: [
      { question: 'What does 1 unit mean in electricity?', answer: 'One unit means one kilowatt-hour, or 1 kWh, of electricity consumed.' },
      { question: 'Why is the effective cost per unit not the same as the tariff?', answer: 'Fixed charges, taxes, and slab changes alter the final average cost.' },
      { question: 'Is the unit cost same in every state?', answer: 'No, tariff rates differ by provider and region.' },
    ],
    relatedCalculatorSlugs: ['electricity-bill', 'electricity-tpddl', 'electricity-jusco', 'electricity-wbsedcl'],
    relatedGuideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', 'fixed-charge-vs-energy-charge'],
  },
  {
    slug: 'fixed-charge-vs-energy-charge',
    title: 'Fixed Charge vs Energy Charge',
    description: 'See how fixed charges and energy charges affect the final bill.',
    answer: 'Energy charge depends on the units you consume, while fixed charge is usually a recurring amount applied even if consumption is low.',
    bullets: [
      'Energy charge changes with usage, so it is the variable part of your bill.',
      'Fixed charge is often linked to connection type or sanctioned load.',
      'A lower usage month can still have a noticeable bill because fixed charges remain.',
      'Understanding both charges helps you explain bill changes quickly.',
    ],
    examples: [
      { title: 'Low usage month', text: 'Even if you use only 40 units, a fixed charge can keep the bill from dropping too far.' },
      { title: 'Higher usage month', text: 'At 300 units, energy charge dominates and slab changes become more visible.' },
    ],
    faqs: [
      { question: 'What is a fixed charge in electricity billing?', answer: 'It is a recurring charge that is generally not tied directly to monthly unit consumption.' },
      { question: 'What is an energy charge?', answer: 'It is the charge you pay for the units of electricity you actually use.' },
      { question: 'Which part changes more month to month?', answer: 'Energy charge changes more because it depends on usage.' },
    ],
    relatedCalculatorSlugs: ['electricity-bill', 'electricity-kseb', 'electricity-tangedco', 'electricity-wbsedcl'],
    relatedGuideSlugs: ['how-electricity-bill-is-calculated', 'electricity-slab-rate-explained', '1-unit-electricity-cost-india'],
  },
];

export function getElectricityProviderContent(slug: string) {
  const provider = ELECTRICITY_PROVIDERS.find(item => item.slug === slug);
  const content = ELECTRICITY_PROVIDER_CONTENT.find(item => item.slug === slug);

  if (!provider || !content) {
    return null;
  }

  return {
    ...provider,
    ...content,
  };
}

export function getElectricityProviderFaqs(providerName: string, state: string): FAQItem[] {
  return [
    {
      question: `How is ${providerName} electricity bill calculated?`,
      answer: `Use the formula: units consumed x slab rate + fixed charges + taxes. ${providerName} bills in ${state} can vary with category and usage band.`,
    },
    {
      question: `What is the unit rate for ${providerName} in ${state}?`,
      answer: `The calculator shows the approximate domestic unit rate for ${providerName} in ${state}. Always check your latest official tariff notice for final billing.`,
    },
    {
      question: `Why does ${providerName} bill change month to month?`,
      answer: 'Bill changes are usually caused by usage changes, slab transitions, fixed charges, and taxes.',
    },
    {
      question: `Can I estimate ${providerName} bill before the official bill arrives?`,
      answer: 'Yes. A calculator helps you estimate the likely monthly bill using your current meter usage and rate context.',
    },
    {
      question: `Is this ${providerName} electricity calculator updated for 2026?`,
      answer: 'Yes. It is designed for 2026-style planning and quick estimate use, not official billing.',
    },
  ];
}

export function getElectricityGuide(slug: string) {
  return ELECTRICITY_GUIDES.find(item => item.slug === slug) || null;
}

export function getElectricityGuideLinks(currentSlug?: string) {
  return ELECTRICITY_GUIDES.filter(item => item.slug !== currentSlug).map(item => ({
    name: item.title,
    path: `/electricity/${item.slug}`,
    description: item.description,
  }));
}

export function getElectricityCalculatorLinks(currentSlug?: string): Calculator[] {
  const currentId = currentSlug ? `electricity-${currentSlug}` : undefined;
  return CALCULATORS.filter(calc => calc.id.startsWith('electricity-') && calc.id !== currentId);
}

export function getElectricityHubProviderLinks() {
  return ELECTRICITY_PROVIDER_GROUPS.map(group => ({
    ...group,
    providers: group.providerSlugs
      .map(slug => getElectricityProviderContent(slug))
      .filter((item): item is NonNullable<ReturnType<typeof getElectricityProviderContent>> => Boolean(item)),
  }));
}
