
import { PollCreateForm } from "@/components/gestion/encuestas/PollCreateForm";
import { getMatchesForSelect } from "@/actions/match-actions";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


export default async function CrearEncuestaPage() {
  const matches = await getMatchesForSelect();
  
  const finishedMatches = matches.filter(m => m.status === 'FINISHED');

  return (
     <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 pt-[var(--header-height)]">
            <PageHero
                title="Crear Nueva Encuesta"
                description="Completa el formulario para lanzar una nueva encuesta."
            />
            <div className="container mx-auto p-4 py-8 md:p-8">
              <div className="max-w-2xl mx-auto">
                 <Button asChild variant="outline" className="mb-4">
                    <Link href="/gestion/encuestas">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Encuestas
                    </Link>
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Detalles de la Encuesta</CardTitle>
                        <CardDescription>
                            Define la pregunta, el tipo y las opciones para tu encuesta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PollCreateForm matches={finishedMatches} />
                    </CardContent>
                </Card>
              </div>
            </div>
        </main>
        <Footer />
      </div>
  );
}
