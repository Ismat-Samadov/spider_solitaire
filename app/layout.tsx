import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgriAdvisor - Ağıllı Kənd Təsərrüfatı Məsləhətçisi',
  description: 'Azərbaycan fermerləri üçün qayda əsaslı kənd təsərrüfatı tövsiyə sistemi. 127+ ağıllı qayda ilə suvarma, gübrələmə və zərərvericilərə qarşı mübarizə.',
  keywords: ['kənd təsərrüfatı', 'fermer', 'Azərbaycan', 'suvarma', 'gübrələmə', 'tövsiyə', 'heyvandarlıq', 'bağçılıq', 'tərəvəzçilik'],
  authors: [{ name: 'AgriAdvisor Team' }],
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body className="min-h-screen">
        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-leaf-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-wheat-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl" />
        </div>
        
        {children}
      </body>
    </html>
  );
}
