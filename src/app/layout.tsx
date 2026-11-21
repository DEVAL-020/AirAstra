import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Montserrat, Onest } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'AirAstra | Winter Smog & Community Clean Air OS',
  description: 'GenAI-powered urban air quality assistant helping families and communities navigate severe winter smog with low-emission routines, DIY filtration hacks, and interactive 3D simulations.',
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
    'Three.js GLSL'
  ]
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        {children}
      </body>
    </html>
  );
}
