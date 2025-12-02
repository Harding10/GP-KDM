
import type {NextConfig} from 'next';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Stratégies de cache Workbox avancées pour offline support
  runtimeCaching: [
    // Cache stratégie pour les images (cache-first, max 30 jours)
    {
      urlPattern: /^https:\/\/(?:res\.cloudinary\.com|images\.unsplash\.com|placehold\.co|picsum\.photos|play-lh\.googleusercontent\.com)\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    // Cache stratégie pour les ressources statiques (cache-first)
    {
      urlPattern: /\.(js|css|woff2|woff|ttf|eot|otf)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
        },
      },
    },
    // Cache stratégie pour Firebase Firestore (network-first, fallback cache)
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firebase-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 jour
        },
        networkTimeoutSeconds: 5,
      },
    },
    // Cache stratégie pour les APIs Google (network-first)
    {
      urlPattern: /^https:\/\/(?:www\.google\.com|accounts\.google\.com|apis\.google\.com)\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'google-apis',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60, // 1 heure
        },
        networkTimeoutSeconds: 3,
      },
    },
  ],
});


const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false, // Désactiver les source maps
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.mos.cms.futurecdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default withPWA(nextConfig);
