export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSchema {
  '@context': string;
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface Calculator {
  id: string;
  name: string;
  path: string;
  description: string;
  icon?: string;
}

export interface ElectricityProvider {
  id: string;
  name: string;
  state: string;
  unitRates: {
    domestic?: number;
    commercial?: number;
    industrial?: number;
  };
  description: string;
  slug: string;
}

export interface PercentageCalculationResult {
  obtained: number;
  total: number;
  percentage: number;
  isGoodScore?: boolean;
  gradeClass?: string;
  percentageRange?: string;
}
