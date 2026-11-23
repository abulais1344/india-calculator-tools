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
    id: 'electricity-consumption',
    name: 'Electricity Consumption Calculator',
    path: '/electricity-consumption-calculator.html',
    description: 'Units and monthly cost for AC, fan, fridge, geyser and other appliances',
  },
  {
    id: 'solar-panel',
    name: 'Solar Panel Calculator',
    path: '/solar-panel-calculator.html',
    description: 'Rooftop solar size, cost, PM Surya Ghar subsidy, savings and payback',
  },
  {
    id: 'solar-subsidy',
    name: 'Solar Subsidy Calculator',
    path: '/solar-subsidy-calculator.html',
    description: 'PM Surya Ghar central subsidy for 1, 2 and 3 kW systems',
  },
  {
    id: 'solar-generation',
    name: 'Solar Generation Calculator',
    path: '/solar-generation-calculator.html',
    description: 'Units per day and month from a rooftop solar system',
  },
  {
    id: 'electricity-bill',
    name: 'Electricity Bill Calculator',
    path: '/electricity-bill-calculator.html',
    description: 'Calculate electricity bill from units consumed',
  },
  {
    id: 'electricity-jusco',
    name: 'JUSCO Electricity Bill Calculator',
    path: '/electricity/jusco-bill-calculator',
    description: 'Estimate JUSCO electricity bills with slab rates and billing breakdown',
  },
  {
    id: 'electricity-msedcl',
    name: 'MSEDCL Electricity Bill Calculator',
    path: '/electricity/msedcl-bill-calculator',
    description: 'Estimate MSEDCL electricity bills with slab rates and billing breakdown',
  },
  {
    id: 'electricity-bescom',
    name: 'BESCOM Electricity Bill Calculator',
    path: '/electricity/bescom-bill-calculator',
    description: 'Estimate BESCOM electricity bills with slab rates and billing breakdown',
  },
  {
    id: 'electricity-kseb',
    name: 'KSEB Electricity Bill Calculator',
    path: '/electricity/kseb-bill-calculator',
    description: 'Estimate KSEB electricity bills with slab rates and billing breakdown',
  },
  {
    id: 'electricity-tpddl',
    name: 'TPDDL Electricity Bill Calculator',
    path: '/electricity/tpddl-bill-calculator',
    description: 'Estimate TPDDL electricity bills with slab rates and billing breakdown',
  },
  {
    id: 'electricity-bses-rajdhani',
    name: 'BSES Rajdhani Electricity Bill Calculator',
    path: '/electricity/bses-rajdhani-bill-calculator',
    description: 'Estimate BSES Rajdhani electricity bills with slab rates and billing breakdown',
  },
  {
    id: 'electricity-wesco',
    name: 'WESCO Electricity Bill Calculator',
    path: '/electricity/wesco-bill-calculator',
    description: 'Estimate WESCO electricity bills with slab rates and billing breakdown',
  },
  {
    id: 'electricity-tangedco',
    name: 'TANGEDCO Electricity Bill Calculator',
    path: '/electricity/tangedco-bill-calculator',
    description: 'Estimate TANGEDCO electricity bills with slab rates and billing breakdown',
  },
  {
    id: 'electricity-tneb',
    name: 'TNEB Electricity Bill Calculator',
    path: '/electricity/tneb-bill-calculator',
    description: 'Estimate TNEB electricity bills with slab rates and billing breakdown',
  },
  {
    id: 'electricity-wbsedcl',
    name: 'WBSEDCL Electricity Bill Calculator',
    path: '/electricity/wbsedcl-bill-calculator',
    description: 'Estimate WBSEDCL electricity bills with slab rates and billing breakdown',
  },
  {
    id: 'fuel-cost',
    name: 'Fuel Cost Calculator',
    path: '/fuel-cost-calculator.html',
    description: 'Calculate fuel cost for your journey',
  },
  {
    id: 'cgpa',
    name: 'CGPA to Percentage Calculator',
    path: '/cgpa-calculator.html',
    description: 'CGPA to percentage (CBSE, AICTE), percentage to CGPA and SGPA to CGPA',
  },
  {
    id: 'attendance',
    name: 'Attendance Calculator',
    path: '/attendance-calculator.html',
    description: 'Classes needed for 75% attendance or how many you can skip',
  },
  {
    id: 'land-area',
    name: 'Land Area Converter',
    path: '/land-area-converter.html',
    description: 'Convert sq ft, acre, hectare, gaj, cent, gunta, marla, kanal and bigha',
  },
  {
    id: 'school-admission-age',
    name: 'School Admission Age Calculator',
    path: '/school-admission-age-calculator.html',
    description: 'Nursery, LKG, UKG and Class 1 eligibility by date of birth',
  },
  {
    id: 'brick',
    name: 'Brick Calculator',
    path: '/brick-calculator.html',
    description: 'Bricks, cement bags and sand for a brick wall',
  },
  {
    id: 'tile',
    name: 'Tile Calculator',
    path: '/tile-calculator.html',
    description: 'Tiles and boxes needed for a floor or wall',
  },
  {
    id: 'zakat',
    name: 'Zakat Calculator',
    path: '/zakat-calculator.html',
    description: 'Zakat on cash, gold, silver and business assets with gold or silver nisab',
  },
  {
    id: 'cng-vs-petrol',
    name: 'CNG vs Petrol Calculator',
    path: '/cng-vs-petrol-calculator.html',
    description: 'CNG vs petrol cost per km, savings and CNG kit payback',
  },
  {
    id: 'ev-vs-petrol',
    name: 'EV vs Petrol Calculator',
    path: '/ev-vs-petrol-calculator.html',
    description: 'Electric car or scooter running cost vs petrol',
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
  percentage: ['percentage', 'marks-percentage', 'cgpa', 'attendance', 'hsc-percentage', 'ssc-percentage', 'cbse-best-of-5'],
  exam: ['neet-marks', 'mht-cet-percentile'],
  loan: ['emi', 'home-loan', 'car-loan', 'personal-loan', 'loan-eligibility'],
  investment: ['sip', 'simple-interest', 'compound-interest', 'fd', 'rd', 'ppf', 'gratuity'],
  salary: ['salary', 'income-tax', 'gst'],
  utility: ['electricity-bill', 'electricity-consumption', 'solar-panel', 'solar-subsidy', 'solar-generation', 'fuel-cost', 'cng-vs-petrol', 'ev-vs-petrol', 'discount', 'bmi', 'age'],
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
