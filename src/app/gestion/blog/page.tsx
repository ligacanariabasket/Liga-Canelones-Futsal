
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const dynamic = 'force-dynamic';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PostList } from '@/components/gestion/blog/PostList';
import { getPosts } from '@/actions/blog-actions';
import Link from 'next/link';

export default async function GestionBlogPage() {
    const { posts } = await getPosts();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Gestión de Blog"
                    description="Crea, edita y administra las publicaciones del blog de la liga."
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <div className="space-y-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Publicaciones Existentes</CardTitle>
                                    <CardDescription>
                                        Aquí puedes ver, editar o eliminar las publicaciones del blog.
                                    </CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href="/gestion/blog/crear">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Crear Publicación
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <PostList posts={posts} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
