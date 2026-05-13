import re

CTA_PATTERN = r'  <div class="container" style="padding-bottom:8px;">\n    <div style="text-align:center;background:var\(--card-bg,#fff\);border-radius:12px;padding:24px 16px;box-shadow:var\(--shadow\);margin-bottom:24px;">\n      <h3 style="margin-bottom:8px;">Calculate Your Exact Age</h3>\n      <p style="margin-bottom:16px;color:var\(--muted\);">Find your precise age in years, months, and days from date of birth — perfect for passport, school admission, and government forms in India\.</p>\n      <a class="btn" href="\.\./age-calculator\.html" style="display:inline-block;padding:14px 28px;font-size:1rem;">Calculate Age Now</a>\n    </div>\n  </div>\n'

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

CTA_LITERAL = '  <div class="container" style="padding-bottom:8px;">\n    <div style="text-align:center;background:var(--card-bg,#fff);border-radius:12px;padding:24px 16px;box-shadow:var(--shadow);margin-bottom:24px;">\n      <h3 style="margin-bottom:8px;">Calculate Your Exact Age</h3>\n      <p style="margin-bottom:16px;color:var(--muted);">Find your precise age in years, months, and days from date of birth \xe2\x80\x94 perfect for passport, school admission, and government forms in India.</p>\n      <a class="btn" href="../age-calculator.html" style="display:inline-block;padding:14px 28px;font-size:1rem;">Calculate Age Now</a>\n    </div>\n  </div>\n'

for f in files:
    with open(f, 'r') as fh:
        content = fh.read()
    count = content.count('Calculate Your Exact Age')
    if count == 2:
        # Remove the first occurrence of the CTA block
        idx = content.find('  <div class="container" style="padding-bottom:8px;">')
        if idx != -1:
            end = content.find('</div>\n</main>', idx)
            if end == -1:
                end = content.find('</div>\n  </div>\n</main>', idx)
            if end == -1:
                end = content.find('  </div>\n</main>', idx)
            # Find the end of the first CTA block - look for the pattern ending
            end_marker = '  </div>\n</main>'
            end_marker2 = '  </div>\n\n</main>'
            # Find the second occurrence of the CTA start
            idx2 = content.find('  <div class="container" style="padding-bottom:8px;">', idx + 10)
            if idx2 != -1:
                # Remove from idx to idx2 (the first CTA)
                content = content[:idx] + content[idx2:]
                print(f"{f} FIXED (removed duplicate, count was {count})")
            else:
                print(f"{f} WARN: could not find second CTA at {idx}")
        else:
            print(f"{f} WARN: start marker not found")
    elif count == 1:
        print(f"{f} OK (count=1)")
    else:
        print(f"{f} count={count}")

    with open(f, 'w') as fh:
        fh.write(content)
