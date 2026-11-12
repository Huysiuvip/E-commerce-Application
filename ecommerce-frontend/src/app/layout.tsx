import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from 'sonner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin', 'vietnamese'],
});

export const metadata: Metadata = {
  title: {
    default: 'ShopSiuVip',
    template: '%s | ShopSiuVip - Trang thương mại điện tử',
  },
  description: 'Mua sắm trực tuyến nhanh và an toàn',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <Toaster position='bottom-right' richColors/>
          </QueryProvider>
      </body>
    </html>
  );
}
