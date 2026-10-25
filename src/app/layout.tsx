import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RouteVector — High-Performance Link Routing & Telemetry',
  description: 'Enterprise-grade, privacy-conscious short link infrastructure powered by Supabase with sub-millisecond server-side redirects and real-time telemetry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
