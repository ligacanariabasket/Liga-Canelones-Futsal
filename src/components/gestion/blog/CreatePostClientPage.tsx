
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { CreatePostForm } from '@/components/gestion/blog/CreatePostForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CreatePostClientPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Crear Nueva Publicación"
                    description="Completa el formulario para añadir un nuevo artículo al blog."
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <Button asChild variant="outline" className="mb-4">
                           <Link href="/gestion/blog">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a la gestión
                           </Link>
                        </Button>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Newspaper className="h-5 w-5 text-primary" />
                                    Nueva Entrada de Blog
                                </CardTitle>
                                <CardDescription>
                                    Rellena los campos o usa la IA para generar el contenido.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CreatePostForm />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
