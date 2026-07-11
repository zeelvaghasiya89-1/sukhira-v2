import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Gabarito } from 'next/font/google';

const gabarito = Gabarito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-gabarito',
  display: 'swap',
});

export const metadata = {
  title: 'Sukhira | Premium Herbal Tea & Wellness',
  description: 'Sukhira makes natural wellness simple, accessible, and enjoyable through thoughtfully crafted herbal products and premium tea rituals.',
  keywords: 'herbal tea, butterfly pea, blue tea, wellness, natural, organic, chamomile, sleep tea, mindfulness'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={gabarito.variable}>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main style={{ minHeight: '80vh' }}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
