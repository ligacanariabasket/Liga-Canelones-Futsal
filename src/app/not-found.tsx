
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 py-8 text-center md:p-8 pt-[var(--header-height)]">
        <div className="flex items-center justify-center gap-4">
            <AlertTriangle className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-primary">404</h1>
        </div>
        <p className="mt-4 text-xl font-medium text-muted-foreground">
            Página No Encontrada
        </p>
        <p className="mt-2 max-w-md text-muted-foreground">
            Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Volver al Inicio</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
