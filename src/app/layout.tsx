import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ParentWise - AI-Powered Parenting Platform',
  description: 'Personalized parenting plans, child development strategies, and family activities powered by artificial intelligence.',
  keywords: ['parenting', 'ai', 'family', 'children', 'development'],
  authors: [{ name: 'ParentWise Team' }],
  openGraph: {
    title: 'ParentWise - AI-Powered Parenting Platform',
    description: 'Empower your parenting journey with AI-driven personalized plans and insights.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}