import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-brand selection:text-white">
        {children}
      </body>
    </html>
  );
}
