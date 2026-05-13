'use client';

import Link from 'next/link';
import { Calculator } from '@/types';

interface RelatedCalculatorsProps {
  calculators: Calculator[];
  title?: string;
  className?: string;
}

export default function RelatedCalculators({
  calculators,
  title = 'Related Calculators',
  className = '',
}: RelatedCalculatorsProps) {
  if (!calculators || calculators.length === 0) {
    return null;
  }

  return (
    <section className={`related-calculators ${className}`}>
      <h3>{title}</h3>
      <div className="grid calculator-grid">
        {calculators.map(calc => (
          <Link
            key={calc.id}
            href={calc.path}
            className="card"
          >
            <h4>{calc.name}</h4>
            <p>{calc.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
