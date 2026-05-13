import { Calculator } from '@/types';

/**
 * Registry of all calculators on CalcVerse
 * Used for internal linking and related calculators section
 */
export const CALCULATORS: Calculator[] = [
  // Percentage & Marks Calculators
  {
    id: 'percentage',
    name: 'Percentage Calculator',
    path: '/percentage-calculator.html',
    description: 'Calculate percentage from any number',
  },
  {
    id: 'marks-percentage',
    name: 'Marks Percentage Calculator',
    path: '/marks-percentage-calculator.html',
    description: 'Calculate percentage from marks obtained and total marks',
  },
  {
    id: 'hsc-percentage',
    name: 'HSC Percentage Calculator',
    path: '/hsc-percentage-calculator.html',
    description: 'Calculate HSC Maharashtra percentage and grades',
  },
  {
    id: 'ssc-percentage',
    name: 'SSC Percentage Calculator',
    path: '/ssc-percentage-calculator.html',
    description: 'Calculate SSC percentage from marks',
  },
  {
    id: 'cbse-best-of-5',
    name: 'CBSE Best of 5 Calculator',
    path: '/cbse-best-of-5-calculator.html',
    description: 'Calculate CBSE best of 5 percentage',
  },
  {
    id: 'neet-marks',
    name: 'NEET Marks Calculator',
    path: '/neet-marks-calculator.html',
    description: 'Calculate NEET score and percentile',
  },
  {
    id: 'mht-cet-percentile',
    name: 'MHT CET Percentile Calculator',
    path: '/mht-cet-percentile-calculator.html',
    description: 'Calculate MHT CET percentile from score',
  },

  // Financial Calculators
  {
    id: 'emi',
    name: 'EMI Calculator',
    path: '/emi-calculator.html',
    description: 'Calculate Equated Monthly Installment for loans',
  },
  {
    id: 'home-loan',
    name: 'Home Loan Calculator',
    path: '/home-loan-calculator.html',
    description: 'Calculate home loan EMI and total interest payable',
  },
  {
    id: 'car-loan',
    name: 'Car Loan Calculator',
    path: '/car-loan-calculator.html',
    description: 'Calculate car loan EMI and affordability',
  },
  {
    id: 'personal-loan',
    name: 'Personal Loan Calculator',
    path: '/personal-loan-calculator.html',
    description: 'Calculate personal loan EMI and costs',
  },
  {
    id: 'loan-eligibility',
    name: 'Loan Eligibility Calculator',
    path: '/loan-eligibility-calculator.html',
    description: 'Check your loan eligibility based on income',
  },

  // Investment Calculators
  {
    id: 'sip',
    name: 'SIP Calculator',
    path: '/sip-calculator.html',
    description: 'Calculate SIP returns and wealth accumulation',
  },
  {
    id: 'simple-interest',
    name: 'Simple Interest Calculator',
    path: '/simple-interest-calculator.html',
    description: 'Calculate simple interest on investments',
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    path: '/compound-interest-calculator.html',
    description: 'Calculate compound interest and future value',
  },
  {
    id: 'fd',
    name: 'FD Calculator',
    path: '/fd-calculator.html',
    description: 'Calculate Fixed Deposit maturity value',
  },
  {
    id: 'rd',
    name: 'RD Calculator',
    path: '/rd-calculator.html',
    description: 'Calculate Recurring Deposit returns',
  },
  {
    id: 'ppf',
    name: 'PPF Calculator',
    path: '/ppf-calculator.html',
    description: 'Calculate Public Provident Fund maturity value',
  },
  {
    id: 'gratuity',
    name: 'Gratuity Calculator',
    path: '/gratuity-calculator.html',
    description: 'Calculate gratuity benefits',
  },

  // Salary & Tax Calculators
  {
    id: 'salary',
    name: 'Salary Calculator',
    path: '/salary-calculator.html',
    description: 'Calculate net salary and deductions',
  },
  {
    id: 'income-tax',
    name: 'Income Tax Calculator',
    path: '/income-tax-calculator.html',
    description: 'Calculate income tax for Indian income',
  },
  {
    id: 'gst',
    name: 'GST Calculator',
    path: '/gst-calculator.html',
    description: 'Calculate GST on products and services',
  },

  // Utility Calculators
  {
    id: 'electricity-bill',
    name: 'Electricity Bill Calculator',
    path: '/electricity-bill-calculator.html',
    description: 'Calculate electricity bill from units consumed',
  },
  {
    id: 'fuel-cost',
    name: 'Fuel Cost Calculator',
    path: '/fuel-cost-calculator.html',
    description: 'Calculate fuel cost for your journey',
  },
  {
    id: 'discount',
    name: 'Discount Calculator',
    path: '/discount-calculator.html',
    description: 'Calculate discount percentage and final price',
  },
  {
    id: 'bmi',
    name: 'BMI Calculator',
    path: '/bmi-calculator.html',
    description: 'Calculate Body Mass Index and health status',
  },
  {
    id: 'age',
    name: 'Age Calculator',
    path: '/age-calculator.html',
    description: 'Calculate exact age in years, months, and days',
  },

  // Generators
  {
    id: 'salary-slip',
    name: 'Salary Slip Generator',
    path: '/salary-slip-generator.html',
    description: 'Generate professional salary slip document',
  },
  {
    id: 'rent-receipt',
    name: 'Rent Receipt Generator',
    path: '/rent-receipt-generator.html',
    description: 'Generate rent receipt for tax purposes',
  },
  {
    id: 'gst-invoice',
    name: 'GST Invoice Generator',
    path: '/gst-invoice-generator.html',
    description: 'Generate GST-compliant invoice',
  },
];

/**
 * Get calculator by ID
 */
export function getCalculatorById(id: string): Calculator | undefined {
  return CALCULATORS.find(calc => calc.id === id);
}

/**
 * Get related calculators (exclude current one)
 */
export function getRelatedCalculators(currentId: string, limit: number = 5): Calculator[] {
  return CALCULATORS.filter(calc => calc.id !== currentId).slice(0, limit);
}

/**
 * Category mappings for better organization
 */
export const CALCULATOR_CATEGORIES = {
  percentage: ['percentage', 'marks-percentage', 'hsc-percentage', 'ssc-percentage', 'cbse-best-of-5'],
  exam: ['neet-marks', 'mht-cet-percentile'],
  loan: ['emi', 'home-loan', 'car-loan', 'personal-loan', 'loan-eligibility'],
  investment: ['sip', 'simple-interest', 'compound-interest', 'fd', 'rd', 'ppf', 'gratuity'],
  salary: ['salary', 'income-tax', 'gst'],
  utility: ['electricity-bill', 'fuel-cost', 'discount', 'bmi', 'age'],
  generator: ['salary-slip', 'rent-receipt', 'gst-invoice'],
};

/**
 * Get calculators by category
 */
export function getCalculatorsByCategory(category: keyof typeof CALCULATOR_CATEGORIES): Calculator[] {
  const ids = CALCULATOR_CATEGORIES[category] || [];
  return ids
    .map(id => getCalculatorById(id))
    .filter((calc): calc is Calculator => calc !== undefined);
}
