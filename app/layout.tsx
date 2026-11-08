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
  title: 'WIZARD TREES // Los Angeles Craft Genetics & Streetwear',
  description: 'Artisanal genetics and uncompromising indoor cultivation. Creators of ZOAP, RS-11, and Zangria. Boutique flower, seed lines, and custom-milled streetwear.',
  keywords: ['Wizard Trees', 'ZOAP', 'RS-11', 'Zangria', 'Cannabis Genetics', 'Los Angeles Craft Flower', 'Streetwear Merch', 'Breeder Seeds'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
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

