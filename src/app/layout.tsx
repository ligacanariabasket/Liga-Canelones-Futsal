
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Roboto, Orbitron } from 'next/font/google';
import { cn } from '@/lib/utils';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn(roboto.variable, orbitron.variable)} suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <title>Liga Canelones Futsal - Pasión por el Fútbol Sala</title>
        <meta name="description" content="Sigue cada partido, cada gol y cada jugada. La plataforma definitiva para los amantes del fútbol sala en la región de Canelones." />
        <meta property="og:title" content="Liga Canelones Futsal" />
        <meta property="og:description" content="La plataforma definitiva para los amantes del futsal en la región." />
        <meta property="og:site_name" content="Liga Canelones Futsal" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_UY" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#282F63" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-roboto antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
