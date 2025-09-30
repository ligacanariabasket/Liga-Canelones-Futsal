
import { getPostBySlug } from '@/actions/blog-actions';
import { EditPostForm } from '@/components/gestion/blog/EditPostForm';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Edit } from 'lucide-react';

interface EditPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Editar Publicación"
                    description={`Estás editando: "${post.title}"`}
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Edit className="h-5 w-5 text-primary" />
                                Formulario de Edición
                            </CardTitle>
                             <CardDescription>
                                Modifica los campos y guarda los cambios.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditPostForm post={post} />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
