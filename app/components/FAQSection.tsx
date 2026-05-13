'use client';

import React from 'react';
import { FAQItem } from '@/types';

interface FAQSectionProps {
  faqs: FAQItem[];
  className?: string;
}

export default function FAQSection({ faqs, className = '' }: FAQSectionProps) {
  const [active, setActive] = React.useState<number | null>(null);

  return (
    <section className={`faq-section ${className}`}>
      <h2>Frequently Asked Questions</h2>
      <div>
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="faq-item"
            open={active === index}
            onClick={() => setActive(active === index ? null : index)}
          >
            <summary>
              <span>
                {faq.question}
                <span style={{ float: 'right' }}>
                  {active === index ? '−' : '+'}
                </span>
              </span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
