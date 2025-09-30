
import { getAllTeams } from '@/actions/team-actions';
import { TeamCard } from '@/components/clubes/TeamCard';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageHero } from '@/components/layout/PageHero';
import type { Team } from '@/types';

export default async function ClubesPage() {
  const teams: Team[] = await getAllTeams();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
       <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Equipos de la Liga"
          description="Conoce a todos los equipos que compiten en la temporada activa."
          icon={true}
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
            {teams.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {teams.map(team => (
                      <TeamCard key={team.id} team={team} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No se encontraron equipos.</p>
              </div>
            )}
       </div>
      </main>
      <Footer />
    </div>
  );
}
