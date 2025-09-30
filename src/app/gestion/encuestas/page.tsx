
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getAllPolls } from "@/actions/poll-actions";
import { PollsDataTable } from "@/components/gestion/encuestas/PollsDataTable";
import { columns, PollColumn } from "@/components/gestion/encuestas/Columns";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Vote } from 'lucide-react';

export default async function GestionEncuestasPage() {
  const polls = await getAllPolls();

  const formattedData: PollColumn[] = polls.map(poll => ({
    id: poll.id,
    question: poll.question,
    type: poll.type,
    match: poll.match ? `${poll.match.teamA.name} vs ${poll.match.teamB.name}` : 'N/A',
    votes: poll._count.votes,
  }));

  return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 pt-[var(--header-height)]">
            <PageHero
                title="Gestión de Encuestas"
                description="Crea y administra encuestas para interactuar con los aficionados."
            />
            <div className="container mx-auto p-4 py-8 md:p-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                        <Vote className="h-5 w-5 text-primary" />
                        Encuestas Activas
                    </CardTitle>
                    <CardDescription>
                      Aquí puedes ver todas las encuestas creadas.
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/gestion/encuestas/crear">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear Encuesta
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <PollsDataTable columns={columns} data={formattedData} />
                </CardContent>
              </Card>
            </div>
        </main>
        <Footer />
      </div>
  );
}
