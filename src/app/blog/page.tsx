
import { Suspense } from 'react';
import { BlogPageContent } from '@/components/blog/BlogPageContent';
import { PageHero } from '@/components/layout/PageHero';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

function BlogPageSkeleton() {
    return (
        <div className="container mx-auto p-4 py-8 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="h-96 bg-muted rounded-lg animate-pulse md:col-span-2 lg:col-span-3"></div>
                <div className="h-96 bg-muted rounded-lg animate-pulse"></div>
                <div className="h-96 bg-muted rounded-lg animate-pulse"></div>
                <div className="h-96 bg-muted rounded-lg animate-pulse"></div>
            </div>
        </div>
    );
}

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PageHero
          title="Blog de Noticias"
          description="Las últimas novedades y análisis de la Liga Canelones Futsal."
        />
        <Suspense fallback={<BlogPageSkeleton />}>
          <BlogPageContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
