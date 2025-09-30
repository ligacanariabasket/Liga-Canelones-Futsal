
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { ManualContent } from '@/components/manual/ManualContent';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ManualSidebar } from '@/components/manual/ManualSidebar';

// Esta función genera los parámetros estáticos para cada página del manual en tiempo de build
export async function generateStaticParams() {
  const manualDir = path.join(process.cwd(), 'src', 'content', 'manual');
  try {
    const files = await fs.readdir(manualDir);
    return files.map((file) => ({
      slug: file.replace(/\.md$/, ''),
    }));
  } catch (error) {
    console.error("Could not read manual directory for static params", error);
    return [];
  }
}

// Función para obtener el contenido del manual
async function getManualContent(slug: string) {
  const manualDir = path.join(process.cwd(), 'src', 'content', 'manual');
  const filePath = path.join(manualDir, `${slug}.md`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    // Extraer el título del primer H1 del markdown
    const titleMatch = content.match(/^#\s+(.*)/);
    const title = titleMatch ? titleMatch[1] : 'Manual';
    return { content, title };
  } catch {
    return null;
  }
}

type ManualDetailPageProps = {
  params: {
    slug: string;
  };
};

export default async function ManualDetailPage({ params }: ManualDetailPageProps) {
  const { slug } = await params;
  const manualData = await getManualContent(slug);

  if (!manualData) {
    notFound();
  }

  const { content, title } = manualData;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero title={title} />
        <div className="container mx-auto max-w-7xl p-4 py-8 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
               <aside className="lg:col-span-1">
                    <ManualSidebar currentSlug={slug} />
                </aside>
                <div className="lg:col-span-3">
                    <article>
                    <ManualContent content={content} />
                    </article>
                     <Button asChild variant="outline" className="mt-12">
                        <Link href="/manual">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al índice del Manual
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
