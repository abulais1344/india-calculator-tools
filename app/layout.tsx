import type { Metadata } from 'next';
import './globals.css';

export const revalidate = false;

export const metadata: Metadata = {
  title: 'CalcVerse - Free India Utility Calculators',
  description:
    'Fast, accurate, and mobile-friendly calculators for finance, tax, marks, and daily use in India. Compare EMI, GST, SIP, FD, salary, and income tax.',
  keywords: [
    'calculator',
    'india',
    'financial calculator',
    'tax calculator',
    'percentage calculator',
    'loan calculator',
    'investment calculator',
  ],
  openGraph: {
    title: 'CalcVerse - Free India Utility Calculators',
    description:
      'Fast, accurate, and mobile-friendly calculators for finance, tax, marks, and daily use in India.',
    type: 'website',
    url: 'https://calcverse.in',
    siteName: 'CalcVerse',
    images: [
      {
        url: 'https://calcverse.in/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CalcVerse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalcVerse - Free India Utility Calculators',
    description:
      'Fast, accurate, and mobile-friendly calculators for finance, tax, marks, and daily use in India.',
    images: ['https://calcverse.in/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

// Keep in sync with buildHeaderNavigation() in public/app.js and public/app.min.js.
const PRIMARY_NAV = [
  { href: '/age-calculator.html', label: 'Age' },
  { href: '/electricity-bill-calculator.html', label: 'Electricity' },
  { href: '/solar-panel-calculator.html', label: 'Solar' },
  { href: '/zakat-calculator.html', label: 'Zakat' },
];

const MORE_NAV = [
  { href: '/', label: 'Home' },
  { href: '/birthday-calculator.html', label: 'Birthday Calculator' },
  { href: '/birth-year-calculator.html', label: 'Birth Year Calculator' },
  { href: '/age-as-on-date-calculator.html', label: 'Age As On Date (Exams)' },
  { href: '/age-calculator-hindi.html', label: 'एज कैलकुलेटर (हिंदी)' },
  { href: '/electricity-consumption-calculator.html', label: 'Appliance Units Calculator' },
  { href: '/solar-subsidy-calculator.html', label: 'Solar Subsidy' },
  { href: '/fuel-cost-calculator.html', label: 'Fuel Cost' },
  { href: '/cng-vs-petrol-calculator.html', label: 'CNG vs Petrol' },
  { href: '/ev-vs-petrol-calculator.html', label: 'EV vs Petrol' },
  { href: '/percentage-calculator.html', label: 'Percentage Calculator' },
  { href: '/marks-percentage-calculator.html', label: 'Marks to Percentage' },
  { href: '/cgpa-calculator.html', label: 'CGPA to Percentage' },
  { href: '/attendance-calculator.html', label: 'Attendance Calculator' },
  { href: '/land-area-converter.html', label: 'Land Area Converter' },
  { href: '/gst-calculator.html', label: 'GST Calculator' },
  { href: '/gst-invoice-generator.html', label: 'GST Invoice' },
  { href: '/rent-receipt-generator.html', label: 'Rent Receipt' },
  { href: '/salary-slip-generator.html', label: 'Salary Slip' },
  { href: '/blog/', label: 'Blog' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="stylesheet" href="/styles.min.css?v=20261124-5" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9017334089053525"
          crossOrigin="anonymous"
        ></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>
      <body>
        <header className="site-header">
          <div className="container header-wrap">
            <a href="/" className="brand" aria-label="CalcVerse Home">
              <img src="/images/logo-wide.png" alt="CalcVerse" className="logo-img" />
            </a>
            <nav className="site-nav" aria-label="Primary Navigation">
              {PRIMARY_NAV.map(item => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
              <details className="nav-dropdown nav-dropdown--panel">
                <summary className="nav-dropdown-toggle">More</summary>
                <div className="nav-dropdown-menu">
                  {MORE_NAV.map(item => (
                    <a key={item.href} href={item.href}>{item.label}</a>
                  ))}
                </div>
              </details>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container footer-wrap">
            <div>
              <strong>CalcVerse</strong>
              <p>Free India utility calculators and tools.</p>
            </div>
            <div className="footer-links">
              <a href="/privacy-policy.html">Privacy Policy</a>
              <a href="/terms.html">Terms</a>
              <a href="/disclaimer.html">Disclaimer</a>
              <a href="/contact.html">Contact</a>
            </div>
            <div>
              <p>&copy; 2026 CalcVerse</p>
            </div>
          </div>
        </footer>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var last=0;document.addEventListener('click',function(e){var s=e.target.closest&&e.target.closest('summary.nav-dropdown-toggle');if(s){e.preventDefault();var n=Date.now();if(n-last<350)return;last=n;var d=s.parentElement;if(d.open)d.removeAttribute('open');else d.setAttribute('open','');}});document.addEventListener('pointerdown',function(e){document.querySelectorAll('details.nav-dropdown[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open');});});})();",
          }}
        />
      </body>
    </html>
  );
}
