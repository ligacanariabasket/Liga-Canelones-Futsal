
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { getAllTeams } from '@/actions/team-actions';
import { SeasonSetup } from '@/components/gestion/configuracion/SeasonSetup';

export default async function ConfiguracionPage() {
    const allTeams = await getAllTeams();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Configuración de Nueva Temporada"
                    description="Sigue los pasos para crear y configurar una nueva temporada para la liga."
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <Card className="max-w-4xl mx-auto shadow-lg">
                        <CardContent className="p-6 md:p-8">
                            <SeasonSetup allTeams={allTeams} />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
