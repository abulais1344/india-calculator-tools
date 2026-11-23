/**
 * Cross-link from electricity bill pages to the solar calculators.
 * Plain <a> tags because the solar pages are static HTML, not Next routes.
 */
export default function SolarPromo({ providerName }: { providerName?: string }) {
  return (
    <div className="card content-block">
      <h2>Cut {providerName ? `Your ${providerName}` : 'Your Electricity'} Bill With Rooftop Solar</h2>
      <p>
        One kW of rooftop solar produces about 120 units a month, and the PM Surya Ghar scheme pays up to ₹78,000 of the
        cost. Enter your monthly units to see the system size, cost after subsidy, savings and payback period.
      </p>
      <div className="calc-link-row">
        <a href="/solar-panel-calculator.html" className="btn">Solar Panel Calculator</a>
        <a href="/solar-subsidy-calculator.html" className="btn secondary">Solar Subsidy Calculator</a>
        <a href="/solar-generation-calculator.html" className="btn secondary">Solar Units per kW</a>
      </div>
    </div>
  );
}
