import type { Metadata } from 'next';
import './globals.css';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="stylesheet" href="/styles.min.css?v=20260427-5" />
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
              <a href="/">Home</a>
              <a href="/gst-calculator.html">GST Calculator</a>
              <a href="/rent-receipt-generator.html">Rent Receipt</a>
              <a href="/salary-slip-generator.html">Salary Slip</a>
              <a href="/blog/">Blog</a>
              <a href="/index.html#more-calculators">More</a>
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
      </body>
    </html>
  );
}
