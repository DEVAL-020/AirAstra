import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AirAstra | Winter Smog & Community Clean Air OS',
  description: 'GenAI-powered urban air quality assistant helping families and communities navigate severe winter smog with low-emission routines, DIY filtration hacks, and interactive 3D simulations.',
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
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-[#060b09] text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
