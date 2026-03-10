import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spider Solitaire',
  description: 'A modern Spider Solitaire card game built with Next.js, Tailwind CSS, and Framer Motion.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
