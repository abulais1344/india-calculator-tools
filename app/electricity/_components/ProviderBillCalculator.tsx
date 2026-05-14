'use client';

import { useMemo, useState } from 'react';

interface ProviderBillCalculatorProps {
  providerName: string;
  baseUnitRate: number;
}

type Category = 'Domestic' | 'Commercial' | 'Industrial';

const RATE_MULTIPLIER: Record<Category, number> = {
  Domestic: 1,
  Commercial: 1.5,
  Industrial: 1.2,
};

export default function ProviderBillCalculator({ providerName, baseUnitRate }: ProviderBillCalculatorProps) {
  const [units, setUnits] = useState<string>('150');
  const [category, setCategory] = useState<Category>('Domestic');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<null | {
    units: number;
    rate: number;
    energyCharge: number;
    fixedCharge: number;
    total: number;
  }>(null);

  const effectiveRate = useMemo(() => baseUnitRate * RATE_MULTIPLIER[category], [baseUnitRate, category]);

  const handleCalculate = () => {
    const parsedUnits = Number(units);
    if (!Number.isFinite(parsedUnits) || parsedUnits < 0) {
      setError('Enter a valid number of units (0 or more).');
      setResult(null);
      return;
    }

    const fixedCharge = 120;
    const energyCharge = parsedUnits * effectiveRate;
    const total = energyCharge + fixedCharge;

    setError('');
    setResult({
      units: parsedUnits,
      rate: effectiveRate,
      energyCharge,
      fixedCharge,
      total,
    });
  };

  return (
    <div className="explanation-section">
      <div className="field">
        <label htmlFor="provider-units">Units Consumed (kWh):</label>
        <input
          id="provider-units"
          type="number"
          min="0"
          step="1"
          value={units}
          onChange={event => setUnits(event.target.value)}
          placeholder="Enter units"
        />
      </div>

      <div className="field">
        <label htmlFor="provider-category">Category:</label>
        <select
          id="provider-category"
          value={category}
          onChange={event => setCategory(event.target.value as Category)}
        >
          <option>Domestic</option>
          <option>Commercial</option>
          <option>Industrial</option>
        </select>
      </div>

      <button type="button" onClick={handleCalculate}>Calculate Bill</button>

      {error ? <p className="safe-private">{error}</p> : null}

      {result ? (
        <div className="card" style={{ marginTop: '12px' }}>
          <h3>{providerName} Estimated Bill</h3>
          <p>Units: {result.units.toFixed(0)} kWh</p>
          <p>Rate Applied: Rs {result.rate.toFixed(2)}/kWh ({category})</p>
          <p>Energy Charge: Rs {result.energyCharge.toFixed(2)}</p>
          <p>Fixed Charge: Rs {result.fixedCharge.toFixed(2)}</p>
          <p><strong>Total Estimated Bill: Rs {result.total.toFixed(2)}</strong></p>
        </div>
      ) : null}
    </div>
  );
}
