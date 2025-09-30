
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getPostBySlug } from '@/actions/blog-actions';
import Image from 'next/image';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { BlogContent } from '@/components/blog/BlogContent';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SinglePostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }
  
  const imageSrc = post.imageUrl || '/placeholder.png';


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 p-4 py-8 md:p-8 pt-[var(--header-height)]">
        <div className="max-w-6xl mx-auto">
          <Button asChild variant="outline" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <article className="lg:col-span-2">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-primary leading-tight">{post.title}</h1>
                <p className="mt-2 text-muted-foreground">
                  <span>{new Date(post.createdAt).toLocaleDateString('es-UY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </p>
              </header>
              
              <Image 
                  src={imageSrc}
                  alt={`Imagen para ${post.title}`}
                  width={1200}
                  height={600}
                  className="w-full rounded-lg object-cover aspect-video mb-8"
              />

              <BlogContent content={post.content} />

            </article>

            <aside className="lg:col-span-1">
              <BlogSidebar />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
