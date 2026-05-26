import { FAQItem } from '@/types';

export interface FinanceGuide {
  slug: string;
  title: string;
  description: string;
  answer: string;
  cluster: 'loan' | 'investment' | 'tax' | 'planning';
  bullets: string[];
  relatedCalculatorIds: string[];
  relatedGuideSlugs: string[];
  faqs: FAQItem[];
}

export const FINANCE_GUIDES: FinanceGuide[] = [
  {
    slug: 'best-home-loan-tenure-india',
    title: 'Best Home Loan Tenure in India',
    description: 'Learn how to choose the best home loan tenure based on EMI comfort and total interest paid.',
    answer: 'The best home loan tenure balances cash flow safety and interest cost; do not optimize for low EMI alone.',
    cluster: 'loan',
    bullets: [
      'Shorter tenure usually saves more interest but raises EMI.',
      'Long tenure lowers EMI but can increase total repayment sharply.',
      'Run three scenarios before finalizing: conservative, comfortable, and aggressive.'
    ],
    relatedCalculatorIds: ['home-loan', 'emi', 'loan-eligibility'],
    relatedGuideSlugs: ['reduce-emi-without-refinance', 'loan-eligibility-before-home-search'],
    faqs: [
      { question: 'Is a 30-year tenure always bad?', answer: 'No, it can be useful for flexibility, but plan periodic prepayment to cut interest.' },
      { question: 'What EMI-to-income ratio is safer?', answer: 'Many borrowers stay near 25-35% of net monthly income for better resilience.' }
    ]
  },
  {
    slug: 'reduce-emi-without-refinance',
    title: 'How to Reduce EMI Without Refinance',
    description: 'Practical methods to reduce EMI burden without switching lenders.',
    answer: 'You can reduce EMI by partial prepayment, extending tenure, and improving loan structure discipline.',
    cluster: 'loan',
    bullets: [
      'Prepay early years for stronger interest savings.',
      'If needed, request tenure restructuring instead of impulsive top-up loans.',
      'Protect emergency fund before using all surplus for prepayment.'
    ],
    relatedCalculatorIds: ['emi', 'personal-loan', 'home-loan'],
    relatedGuideSlugs: ['best-home-loan-tenure-india', 'emergency-fund-vs-prepayment-priority'],
    faqs: [
      { question: 'Does part prepayment always reduce EMI?', answer: 'It depends on lender option chosen: EMI reduction or tenure reduction.' },
      { question: 'Which gives larger savings?', answer: 'Tenure reduction usually gives higher total interest savings in many cases.' }
    ]
  },
  {
    slug: 'car-loan-down-payment-vs-emi',
    title: 'Car Loan Down Payment vs EMI Tradeoff',
    description: 'Understand how down payment size changes your EMI, interest burden, and car affordability.',
    answer: 'A higher down payment lowers EMI and lifetime interest, but keep liquidity for insurance and maintenance.',
    cluster: 'loan',
    bullets: [
      'Target a balanced down payment, not a zero-cash purchase approach.',
      'Compare 15%, 25%, and 35% down payment scenarios.',
      'Include recurring ownership costs, not just EMI.'
    ],
    relatedCalculatorIds: ['car-loan', 'emi', 'fuel-cost'],
    relatedGuideSlugs: ['fuel-cost-monthly-budget-by-commute'],
    faqs: [
      { question: 'Is minimum down payment a good idea?', answer: 'Only if cash flow is uncertain and emergency reserves are maintained.' },
      { question: 'Should I use all savings as down payment?', answer: 'No, keep reserves for annual costs and contingencies.' }
    ]
  },
  {
    slug: 'personal-loan-eligibility-by-salary',
    title: 'Personal Loan Eligibility by Salary',
    description: 'Estimate eligibility ranges using salary, obligations, and debt ratio discipline.',
    answer: 'Eligibility is strongly influenced by net income, fixed obligations, and credit profile consistency.',
    cluster: 'loan',
    bullets: [
      'Lower existing EMI improves sanction probability and amount.',
      'Stable salary credits often matter more than one-time income spikes.',
      'Use eligibility estimates before applying repeatedly.'
    ],
    relatedCalculatorIds: ['loan-eligibility', 'personal-loan', 'salary'],
    relatedGuideSlugs: ['loan-eligibility-before-home-search'],
    faqs: [
      { question: 'Do all lenders use same eligibility formula?', answer: 'No, policy and risk models differ by lender.' },
      { question: 'Can overtime and incentives help?', answer: 'Some lenders count variable pay partially if track record is stable.' }
    ]
  },
  {
    slug: 'fixed-vs-floating-home-loan-rate',
    title: 'Fixed vs Floating Home Loan Rate',
    description: 'Compare fixed and floating rates for risk, predictability, and long-term cost.',
    answer: 'Fixed rates improve certainty; floating rates can be cheaper over cycles but carry uncertainty.',
    cluster: 'loan',
    bullets: [
      'Choose fixed if payment certainty is priority.',
      'Choose floating if you can absorb rate-cycle volatility.',
      'Review reset clauses and spread details carefully.'
    ],
    relatedCalculatorIds: ['home-loan', 'emi'],
    relatedGuideSlugs: ['best-home-loan-tenure-india'],
    faqs: [
      { question: 'Can fixed rates change later?', answer: 'Some products are fixed only for an initial period, then reset.' },
      { question: 'Is floating always risky?', answer: 'Risk depends on your buffer and exposure to changing rates.' }
    ]
  },
  {
    slug: 'should-you-prepay-home-loan-or-invest',
    title: 'Should You Prepay Home Loan or Invest?',
    description: 'A framework to decide between debt reduction and investing surplus money.',
    answer: 'The right choice depends on effective loan cost, tax impact, risk tolerance, and investment discipline.',
    cluster: 'planning',
    bullets: [
      'Compare post-tax loan cost with realistic post-tax investment return.',
      'Maintain emergency corpus before aggressive prepayment.',
      'Use split strategy if decision is not obvious.'
    ],
    relatedCalculatorIds: ['home-loan', 'sip', 'compound-interest'],
    relatedGuideSlugs: ['emergency-fund-vs-prepayment-priority'],
    faqs: [
      { question: 'Should all bonus money go to prepayment?', answer: 'Not always; preserve liquidity and diversify goals.' },
      { question: 'Can investing beat prepayment?', answer: 'It can, but comes with return variability and discipline risk.' }
    ]
  },
  {
    slug: 'sip-vs-rd-for-monthly-savers',
    title: 'SIP vs RD for Monthly Savers',
    description: 'Choose between SIP and RD based on timeline, return expectation, and volatility comfort.',
    answer: 'RD offers certainty, while SIP offers higher long-run growth potential with market fluctuations.',
    cluster: 'investment',
    bullets: [
      'Use RD for short and fixed timeline goals.',
      'Use SIP for long goals where volatility can be tolerated.',
      'A blended allocation often works better than extremes.'
    ],
    relatedCalculatorIds: ['sip', 'rd', 'fd'],
    relatedGuideSlugs: ['monthly-sip-target-1-crore'],
    faqs: [
      { question: 'Is RD safer than SIP?', answer: 'Value stability is typically higher in RD, but long-term growth may be lower.' },
      { question: 'Can I do both?', answer: 'Yes, split by goal horizon and certainty requirements.' }
    ]
  },
  {
    slug: 'monthly-sip-target-1-crore',
    title: 'Monthly SIP Needed to Reach 1 Crore',
    description: 'Estimate monthly SIP contributions needed for a Rs 1 crore corpus goal.',
    answer: 'Required SIP depends on expected return and timeline; longer duration reduces required monthly amount.',
    cluster: 'investment',
    bullets: [
      'Start early to let compounding do most of the work.',
      'Increase SIP with income growth to accelerate outcomes.',
      'Review plan annually rather than changing monthly.'
    ],
    relatedCalculatorIds: ['sip', 'compound-interest'],
    relatedGuideSlugs: ['sip-vs-rd-for-monthly-savers', 'ppf-vs-sip-15-year-comparison'],
    faqs: [
      { question: 'Can I reach 1 crore with small SIP?', answer: 'Yes, with a sufficiently long horizon and contribution increases.' },
      { question: 'Should I assume high return rates?', answer: 'Use conservative ranges for safer planning.' }
    ]
  },
  {
    slug: 'ppf-vs-sip-15-year-comparison',
    title: 'PPF vs SIP Over 15 Years',
    description: 'Compare PPF and SIP over 15 years for growth, liquidity, and risk profile.',
    answer: 'PPF gives stable, policy-driven growth while SIP can deliver higher potential with volatility.',
    cluster: 'investment',
    bullets: [
      'PPF suits conservative long-horizon savers.',
      'SIP suits growth-oriented investors with volatility tolerance.',
      'Blend both to balance stability and upside.'
    ],
    relatedCalculatorIds: ['ppf', 'sip', 'fd'],
    relatedGuideSlugs: ['monthly-sip-target-1-crore'],
    faqs: [
      { question: 'Is PPF enough for retirement?', answer: 'It can be a base layer, but many users add growth assets too.' },
      { question: 'Is SIP better in all cases?', answer: 'No, suitability depends on risk appetite and liquidity needs.' }
    ]
  },
  {
    slug: 'income-tax-old-vs-new-regime-checklist',
    title: 'Old vs New Tax Regime Checklist',
    description: 'A practical checklist to choose the right income tax regime based on your profile.',
    answer: 'Run both regime calculations with your actual deductions and choose based on net payable tax and cash flow.',
    cluster: 'tax',
    bullets: [
      'Do not assume old regime is always better.',
      'Factor in actual eligible deductions, not planned ones only.',
      'Revisit decision when salary structure changes.'
    ],
    relatedCalculatorIds: ['income-tax', 'salary'],
    relatedGuideSlugs: ['salary-hike-percent-to-in-hand-impact'],
    faqs: [
      { question: 'Can I switch regime yearly?', answer: 'Rules differ by taxpayer type; verify current compliance guidance.' },
      { question: 'Should investment products drive regime choice?', answer: 'Regime choice should follow total tax impact, not one product.' }
    ]
  },
  {
    slug: 'salary-hike-percent-to-in-hand-impact',
    title: 'Salary Hike Percent vs In-Hand Impact',
    description: 'Understand why a salary hike percentage does not translate one-to-one into in-hand growth.',
    answer: 'In-hand growth is shaped by tax slab movement, deductions, and compensation structure shifts.',
    cluster: 'tax',
    bullets: [
      'Check monthly net increase, not annual CTC headline alone.',
      'Review PF, tax, and variable pay changes after revision.',
      'Align savings increments with real in-hand delta.'
    ],
    relatedCalculatorIds: ['salary', 'income-tax'],
    relatedGuideSlugs: ['ctc-to-in-hand-common-deductions'],
    faqs: [
      { question: 'Why did 20% hike not feel big monthly?', answer: 'Higher deductions and tax effects can reduce net impact.' },
      { question: 'How should I budget after hike?', answer: 'Split increment across savings, goals, and lifestyle upgrades intentionally.' }
    ]
  },
  {
    slug: 'ctc-to-in-hand-common-deductions',
    title: 'CTC to In-Hand: Common Deductions Explained',
    description: 'Break down PF, tax, and other salary deductions that affect in-hand pay.',
    answer: 'CTC includes components that may not be monthly cash, so deduction mapping is essential for planning.',
    cluster: 'tax',
    bullets: [
      'Separate fixed cash, variable pay, and annual benefits.',
      'Track statutory deductions every month.',
      'Use annual declaration discipline to avoid year-end shocks.'
    ],
    relatedCalculatorIds: ['salary', 'income-tax', 'rent-receipt'],
    relatedGuideSlugs: ['salary-hike-percent-to-in-hand-impact'],
    faqs: [
      { question: 'Is employer PF part of in-hand salary?', answer: 'No, it is part of CTC but not monthly take-home cash.' },
      { question: 'Can deductions be optimized legally?', answer: 'Yes, via compliant tax planning and salary structuring choices.' }
    ]
  },
  {
    slug: 'break-even-point-for-small-business-india',
    title: 'Break-Even Point for Small Businesses',
    description: 'Compute and interpret break-even point for practical small-business planning.',
    answer: 'Break-even analysis helps set sales targets where total revenue starts covering total costs.',
    cluster: 'planning',
    bullets: [
      'Track fixed and variable costs separately.',
      'Recompute break-even when pricing changes.',
      'Use monthly monitoring to avoid delayed correction.'
    ],
    relatedCalculatorIds: ['break-even', 'gst', 'discount'],
    relatedGuideSlugs: ['gst-inclusive-vs-exclusive-price-formula'],
    faqs: [
      { question: 'Can break-even be used for services?', answer: 'Yes, with cost and contribution margin assumptions.' },
      { question: 'How often should break-even be recalculated?', answer: 'Whenever major cost or price inputs shift.' }
    ]
  },
  {
    slug: 'simple-vs-compound-interest-when-to-use',
    title: 'Simple vs Compound Interest: When to Use Which',
    description: 'Understand when simple interest or compound interest is relevant in real decisions.',
    answer: 'Simple interest suits linear calculations; compound interest suits reinvestment and long-horizon growth estimates.',
    cluster: 'investment',
    bullets: [
      'Use simple interest for short fixed computations.',
      'Use compound interest for multi-year growth planning.',
      'Compounding frequency can materially change outcomes.'
    ],
    relatedCalculatorIds: ['simple-interest', 'compound-interest', 'fd'],
    relatedGuideSlugs: ['monthly-sip-target-1-crore'],
    faqs: [
      { question: 'Does compounding always win?', answer: 'Over longer horizons it usually improves outcomes, assuming stable contribution and return.' },
      { question: 'Should I compare annualized outcomes?', answer: 'Yes, annualized comparisons improve decision clarity.' }
    ]
  },
  {
    slug: 'gst-inclusive-vs-exclusive-price-formula',
    title: 'GST Inclusive vs Exclusive Price Formula',
    description: 'Apply GST inclusive and exclusive formulas correctly for billing and pricing.',
    answer: 'Correct GST conversion avoids invoice mismatch, margin confusion, and client billing disputes.',
    cluster: 'tax',
    bullets: [
      'Know whether your quoted price already includes GST.',
      'Use separate tax line for transparent invoicing.',
      'Audit rate assumptions in every product category.'
    ],
    relatedCalculatorIds: ['gst', 'gst-invoice', 'discount'],
    relatedGuideSlugs: ['break-even-point-for-small-business-india'],
    faqs: [
      { question: 'Can GST-inclusive pricing hurt margin visibility?', answer: 'Yes, unless base price and tax components are tracked clearly.' },
      { question: 'Is GST formula same for all rates?', answer: 'Method is same; only tax rate changes.' }
    ]
  },
  {
    slug: 'fuel-cost-monthly-budget-by-commute',
    title: 'Monthly Fuel Cost Budget by Commute',
    description: 'Estimate monthly commuting fuel costs and improve household budget accuracy.',
    answer: 'A simple commute-to-monthly conversion prevents budget leaks and helps realistic savings planning.',
    cluster: 'planning',
    bullets: [
      'Use realistic mileage rather than brochure mileage.',
      'Factor traffic and AC usage for city commutes.',
      'Update assumptions when fuel prices change.'
    ],
    relatedCalculatorIds: ['fuel-cost', 'salary', 'discount'],
    relatedGuideSlugs: ['emergency-fund-vs-prepayment-priority'],
    faqs: [
      { question: 'Should weekend travel be included?', answer: 'Yes, include all recurring movement for accurate monthly estimation.' },
      { question: 'How often should I revise fuel budget?', answer: 'At least monthly or whenever fuel prices move materially.' }
    ]
  },
  {
    slug: 'loan-eligibility-before-home-search',
    title: 'Check Loan Eligibility Before Home Search',
    description: 'Why pre-checking eligibility saves time during home buying decisions.',
    answer: 'Eligibility-first planning prevents unrealistic property shortlisting and negotiation stress.',
    cluster: 'loan',
    bullets: [
      'Set budget range after eligibility and own contribution.',
      'Keep legal and registration costs in separate budget.',
      'Recheck eligibility if income or liabilities change.'
    ],
    relatedCalculatorIds: ['loan-eligibility', 'home-loan', 'emi'],
    relatedGuideSlugs: ['best-home-loan-tenure-india'],
    faqs: [
      { question: 'Is pre-approval necessary?', answer: 'Not mandatory, but it improves confidence and speed in negotiations.' },
      { question: 'Can eligibility differ from final sanction?', answer: 'Yes, final underwriting can revise approved amount.' }
    ]
  },
  {
    slug: 'emergency-fund-vs-prepayment-priority',
    title: 'Emergency Fund vs Loan Prepayment Priority',
    description: 'Decide when to prioritize emergency corpus over aggressive loan prepayment.',
    answer: 'In uncertain cash-flow environments, emergency liquidity usually comes before accelerated debt reduction.',
    cluster: 'planning',
    bullets: [
      'Build minimum emergency coverage before heavy prepayment.',
      'Prepay after basic liquidity and insurance are in place.',
      'Review strategy after major life events.'
    ],
    relatedCalculatorIds: ['emi', 'home-loan', 'salary'],
    relatedGuideSlugs: ['should-you-prepay-home-loan-or-invest'],
    faqs: [
      { question: 'How much emergency fund is enough?', answer: 'Many households target 3-6 months of essential expenses as a baseline.' },
      { question: 'Can I do both simultaneously?', answer: 'Yes, a split allocation can balance safety and debt reduction.' }
    ]
  },
  {
    slug: 'rent-vs-buy-home-india-emi-lens',
    title: 'Rent vs Buy in India Through EMI Lens',
    description: 'Evaluate rent vs buy using EMI sustainability, flexibility, and long-term goals.',
    answer: 'Rent vs buy should consider job mobility, down payment capacity, and long-term ownership intent.',
    cluster: 'planning',
    bullets: [
      'Compare total ownership cost, not just EMI.',
      'Use realistic maintenance and vacancy assumptions.',
      'Decision can change with city, tenure, and career stage.'
    ],
    relatedCalculatorIds: ['home-loan', 'emi', 'salary'],
    relatedGuideSlugs: ['loan-eligibility-before-home-search'],
    faqs: [
      { question: 'Is buying always better than renting?', answer: 'No, it depends on horizon, flexibility needs, and total cost structure.' },
      { question: 'Should tax benefits decide buying?', answer: 'Tax benefit can help, but should not override affordability fundamentals.' }
    ]
  },
  {
    slug: 'fd-ladder-strategy-for-stable-cash-flow',
    title: 'FD Ladder Strategy for Stable Cash Flow',
    description: 'Use FD laddering to improve liquidity without sacrificing all return stability.',
    answer: 'FD laddering splits deposits across maturities to improve reinvestment flexibility and reduce timing risk.',
    cluster: 'investment',
    bullets: [
      'Stagger maturity dates for periodic liquidity.',
      'Reinvest maturities based on updated rates and goals.',
      'Use laddering for emergency-plus-yield balance.'
    ],
    relatedCalculatorIds: ['fd', 'rd', 'compound-interest'],
    relatedGuideSlugs: ['sip-vs-rd-for-monthly-savers'],
    faqs: [
      { question: 'Is FD ladder better than one large FD?', answer: 'It often improves flexibility and rate-cycle handling.' },
      { question: 'Can laddering reduce returns?', answer: 'Sometimes in rising-rate environments, but it reduces concentration risk.' }
    ]
  },
  {
    slug: 'annual-bonus-allocation-rule-india',
    title: 'Annual Bonus Allocation Rule in India',
    description: 'A practical split rule to allocate annual bonus across debt, savings, and long-term goals.',
    answer: 'A rule-based bonus split improves discipline and prevents one-time spending spikes from derailing goals.',
    cluster: 'planning',
    bullets: [
      'Assign fixed percentages to debt, emergency fund, and investing.',
      'Pre-decide usage before bonus credit hits account.',
      'Review the split annually as liabilities change.'
    ],
    relatedCalculatorIds: ['salary', 'sip', 'emi'],
    relatedGuideSlugs: ['should-you-prepay-home-loan-or-invest', 'emergency-fund-vs-prepayment-priority'],
    faqs: [
      { question: 'Should bonus be fully invested?', answer: 'Not if liquidity and debt priorities are still underfunded.' },
      { question: 'Can bonus allocation improve tax outcomes?', answer: 'It can indirectly, through better planning and timely declarations.' }
    ]
  }
];

export function getFinanceGuide(slug: string): FinanceGuide | undefined {
  return FINANCE_GUIDES.find((guide) => guide.slug === slug);
}

export function getFinanceGuideLinks() {
  return FINANCE_GUIDES.map((guide) => ({
    id: `finance-${guide.slug}`,
    name: guide.title,
    path: `/finance/${guide.slug}`,
    description: guide.description,
  }));
}

export function getFinanceGuidesByCluster(cluster: FinanceGuide['cluster']) {
  return FINANCE_GUIDES.filter((guide) => guide.cluster === cluster);
}
