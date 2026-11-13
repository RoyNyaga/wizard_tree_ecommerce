import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AgeGate } from '@/components/layout/AgeGate';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { Toast } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'WIZARD TREES // Where Cannabis Meets Artistry | Los Angeles Craft Genetics',
  description:
    'Welcome to Wizard Trees, where cannabis meets artistry. Based in Los Angeles, we craft premium exotic strains, world-renowned genetics, and artisanal small-batch flower sought worldwide.',
  keywords: [
    'Wizard Trees',
    'Where Cannabis Meets Artistry',
    'ZOAP',
    'RS-11',
    'Zangria',
    'Studio 54',
    'Black Magic',
    'Los Angeles Craft Cannabis',
    'Exotic Strains',
    'Cannabis Genetics',
    'Breeder Seeds',
    'Streetwear',
  ],
  icons: {
    icon: [
      { url: '/images/brand/logo.png', type: 'image/png' },
    ],
    shortcut: '/images/brand/logo.png',
    apple: [
      { url: '/images/brand/logo.png', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'WIZARD TREES // Where Cannabis Meets Artistry',
    description:
      'Welcome to Wizard Trees, where cannabis meets artistry. Based in Los Angeles, we craft premium exotic strains, world-renowned genetics, and artisanal small-batch flower sought worldwide.',
    siteName: 'Wizard Trees',
    images: [
      {
        url: '/images/brand/logo.png',
        width: 800,
        height: 800,
        alt: 'Wizard Trees Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WIZARD TREES // Where Cannabis Meets Artistry',
    description:
      'Welcome to Wizard Trees, where cannabis meets artistry. Based in Los Angeles, we craft premium exotic strains, world-renowned genetics, and artisanal small-batch flower sought worldwide.',
    images: ['/images/brand/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/images/brand/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/images/brand/logo.png" />
        <link rel="apple-touch-icon" href="/images/brand/logo.png" />
      </head>
      <body className="min-h-screen bg-[#07070a] text-white flex flex-col justify-between selection:bg-purple-600 selection:text-white">
        <QueryProvider>
          <CartProvider>
            {/* Mandatory 21+ Age Compliance Gate */}
            <AgeGate />

            {/* Persistent Global Header */}
            <Navbar />

            {/* Main Viewport Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Slide-out Cart Drawer */}
            <CartDrawer />

            {/* Global Floating Toast */}
            <Toast />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

