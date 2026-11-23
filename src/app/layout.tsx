import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Montserrat, Onest } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const onest = Onest({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-brand',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090807' },
    { media: '(prefers-color-scheme: light)', color: '#faf9f6' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://airastra.netlify.app'),
  title: 'AirAstra | Winter Smog & Community Clean Air OS',
  description: 'GenAI-powered urban air quality assistant helping families and communities navigate severe winter smog with low-emission routines, DIY filtration hacks, and interactive 3D simulations.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AirAstra | Winter Smog & Community Clean Air OS',
    description: 'GenAI-powered urban air quality assistant helping families and communities navigate severe winter smog with low-emission routines, DIY filtration hacks, and interactive 3D simulations.',
    url: 'https://airastra.netlify.app',
    siteName: 'AirAstra',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AirAstra | Winter Smog & Community Clean Air OS',
    description: 'GenAI-powered urban air quality assistant helping families and communities navigate severe winter smog with low-emission routines and DIY filtration hacks.',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ]
  },
  keywords: [
    'AirAstra',
    'Winter Smog',
    'Air Quality Index',
    'AQI',
    'PM2.5',
    'Corsi-Rosenthal Box',
    'GenAI Assistant',
    'Thermal Inversion',
    'Atmospheric Simulation'
  ]
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AirAstra',
  url: 'https://airastra.netlify.app',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'All',
  description: 'GenAI-powered urban air quality assistant helping families and communities navigate severe winter smog with low-emission routines, DIY filtration hacks, and interactive 3D simulations.',
  featureList: [
    'Real-time urban air quality index and pollutant telemetry',
    'Cold surface thermal inversion forecasting',
    '3D interactive Corsi-Rosenthal filter CAD simulation',
    'Personalized demographic protection advisor',
    'Low-emission errand trip combiner',
    'Astra conversational voice air doctor'
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('airastra-theme') || 'dark';
                var isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${montserrat.variable} ${onest.variable} font-sans min-h-screen bg-background text-foreground text-[17px] leading-relaxed antialiased selection:bg-brand selection:text-white`}>
        <ThemeProvider defaultTheme="dark" storageKey="airastra-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
