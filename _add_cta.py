import os

CTA = '''  <div class="container" style="padding-bottom:8px;">
    <div style="text-align:center;background:var(--card-bg,#fff);border-radius:12px;padding:24px 16px;box-shadow:var(--shadow);margin-bottom:24px;">
      <h3 style="margin-bottom:8px;">Calculate Your Exact Age</h3>
      <p style="margin-bottom:16px;color:var(--muted);">Find your precise age in years, months, and days from date of birth — perfect for passport, school admission, and government forms in India.</p>
      <a class="btn" href="../age-calculator.html" style="display:inline-block;padding:14px 28px;font-size:1rem;">Calculate Age Now</a>
    </div>
  </div>
'''

files = [
    'blog/fixed-vs-floating-interest-rate.html',
    'blog/how-to-calculate-emi.html',
    'blog/how-to-reduce-emi.html',
    'blog/how-to-save-income-tax.html',
    'blog/index.html',
    'blog/invest-10000-per-month-india.html',
    'blog/old-vs-new-tax-regime.html',
    'blog/percentage-calculation-guide.html',
    'blog/personal-loan-vs-credit-card.html',
    'blog/salary-needed-for-home-loan.html',
    'blog/sip-vs-fd-vs-rd.html',
    'blog/sip-vs-fd.html',
    'blog/tax-saving-tips.html',
]

for f in files:
    with open(f, 'r') as fh:
        content = fh.read()
    if '</main>' not in content:
        print(f"WARN: no </main> in {f}")
        continue
    new_content = content.replace('</main>', CTA + '</main>', 1)
    with open(f, 'w') as fh:
        fh.write(new_content)
    print(f"{f} OK")
