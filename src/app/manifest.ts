import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AirAstra | Winter Smog & Community Clean Air OS',
    short_name: 'AirAstra',
    description: 'GenAI-powered urban air quality assistant helping families and communities navigate severe winter smog with low-emission routines, DIY filtration hacks, and interactive 3D simulations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090807',
    theme_color: '#090807',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
