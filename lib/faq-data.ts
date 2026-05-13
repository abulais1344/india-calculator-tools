import { FAQItem } from '@/types';

/**
 * Common FAQs for percentage calculators
 */
export const PERCENTAGE_FAQS: FAQItem[] = [
  {
    question: 'How to calculate 438 out of 500 as a percentage?',
    answer:
      'Use the formula: (Obtained Marks / Total Marks) × 100. Example: (438 / 500) × 100 = 87.6%. This works for school, college, and entrance exam marks.',
  },
  {
    question: '438/500 in percentage is how much?',
    answer:
      '438/500 is 87.6%. Divide 438 by 500 and multiply by 100 to get the exact percentage.',
  },
  {
    question: 'What is a good percentage score in India?',
    answer:
      'A score above 75% is generally considered good. 90%+ is excellent, 80-89% is very good, and 70-79% is good in most school and college contexts.',
  },
  {
    question: 'How are grades calculated from percentage?',
    answer:
      'Common grading ranges are: A+ (90-100%), A (80-89%), B (70-79%), C (60-69%), D (50-59%), and F (below 50%). Exact cutoffs can vary by board.',
  },
  {
    question: 'Can I calculate percentage for any marks format?',
    answer: 'Yes. This works for any values like 438 out of 500, 320 out of 400, or 250 out of 300. Just divide obtained marks by total and multiply by 100.',
  },
  {
    question: 'Is this percentage calculator free and updated?',
    answer:
      'Yes. The calculator is free to use, requires no signup, and is updated with current examples and grading guidance for 2026.',
  },
];

/**
 * Electricity bill FAQs
 */
export const ELECTRICITY_FAQS: FAQItem[] = [
  {
    question: 'How to calculate electricity bill from units?',
    answer:
      'Use this formula: Bill = (Units × Slab Rate) + Fixed Charges + Taxes. Final bill depends on your provider, slab range, and state rules.',
  },
  {
    question: 'What is 1 unit of electricity?',
    answer: '1 unit means 1 kWh (kilowatt-hour): using 1,000 watts of power for 1 hour. Your meter records usage in these units.',
  },
  {
    question: 'Why does electricity bill increase in summer?',
    answer:
      'ACs, coolers, and longer usage hours increase unit consumption in summer. Higher slab usage can also raise your effective per-unit cost.',
  },
  {
    question: 'How can I reduce electricity bill quickly?',
    answer:
      'Use LED lights, set AC to efficient temperatures, switch off standby loads, and reduce peak-time usage. Regular appliance maintenance also helps.',
  },
  {
    question: 'Are domestic and commercial unit rates different?',
    answer:
      'Yes. Commercial and industrial tariffs are usually higher than domestic tariffs. This calculator primarily helps estimate domestic bills.',
  },
  {
    question: 'Is this electricity bill calculator updated for 2026 rates?',
    answer:
      'Yes, it is updated for 2026 estimation logic and provider context. Always verify final payable amounts with your official utility bill.',
  },
];

/**
 * Loan & EMI FAQs
 */
export const EMI_FAQS: FAQItem[] = [
  {
    question: 'What does EMI mean?',
    answer:
      'EMI (Equated Monthly Installment) is the fixed amount you pay monthly to repay a loan. It includes principal and interest components.',
  },
  {
    question: 'How is EMI calculated?',
    answer:
      'EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where P is principal, R is monthly interest rate, and N is number of months.',
  },
  {
    question: 'Can I reduce my EMI?',
    answer:
      'Yes, by paying extra principal amount (pre-payment), increasing your tenure, or refinancing at lower rates if eligible.',
  },
];

/**
 * Tax calculator FAQs
 */
export const TAX_CALCULATOR_FAQS: FAQItem[] = [
  {
    question: 'What is the difference between old and new tax regimes?',
    answer:
      'Old regime had more deductions but progressive slabs. New regime has simpler slabs but fewer deductions. New regime is beneficial for salaried individuals without many deductions.',
  },
  {
    question: 'Can I switch between old and new tax regimes?',
    answer:
      'Yes, eligible individuals can choose which regime to file under, but you must use the same regime for the entire financial year.',
  },
  {
    question: 'What is standard deduction?',
    answer: 'Standard deduction (₹50,000 under new regime) is a flat deduction available to salaried individuals without claiming any other deductions.',
  },
];

/**
 * SIP & Investment FAQs
 */
export const SIP_FAQS: FAQItem[] = [
  {
    question: 'What is SIP (Systematic Investment Plan)?',
    answer:
      'SIP is a method of investing fixed amount at regular intervals (usually monthly) in mutual funds. It reduces market risk through rupee cost averaging.',
  },
  {
    question: 'How much should I invest in SIP?',
    answer:
      'SIP amounts typically range from ₹500 to ₹1,00,000+ monthly. Choose based on your income, goals, and financial situation. Even small amounts compound over time.',
  },
  {
    question: 'What returns can I expect from SIP?',
    answer:
      'Returns depend on fund type and market conditions. Equity funds historically return 10-15% annually, while debt funds return 5-8%. Past performance doesn\'t guarantee future returns.',
  },
];

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(
  category: 'percentage' | 'electricity' | 'emi' | 'tax' | 'sip'
): FAQItem[] {
  const FAQMap = {
    percentage: PERCENTAGE_FAQS,
    electricity: ELECTRICITY_FAQS,
    emi: EMI_FAQS,
    tax: TAX_CALCULATOR_FAQS,
    sip: SIP_FAQS,
  };

  return FAQMap[category] || [];
}
