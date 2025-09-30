
import { notFound } from 'next/navigation';
import { getMatchById, getChronicleByMatchId } from '@/actions/match-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { ChronicleGenerator } from '@/components/gestion/cronicas/ChronicleGenerator';
import { SavedChronicle } from '@/components/gestion/cronicas/SavedChronicle';
import { Separator } from '@/components/ui/separator';
import { MatchEventsJson } from '@/components/gestion/cronicas/MatchEventsJson';
import type { MatchChronicle as TMatchChronicle } from '@/types';
import type { GenerateMatchChronicleOutput } from '@/types/genkit-types';


interface ChroniclePageProps {
  params: {
    id: string;
  };
}

type ChronicleJson = {
    partialChronicles?: { segment: number, content: string }[];
    finalChronicle?: GenerateMatchChronicleOutput | null;
}

export default async function ChroniclePage({ params }: ChroniclePageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }
  
  const match = await getMatchById(id);
  const savedChronicle: TMatchChronicle | null = await getChronicleByMatchId(id);
  
  if (!match) {
    notFound();
  }
  
  let chronicleData: ChronicleJson | null = null;
  if (savedChronicle && savedChronicle.chronicle && typeof savedChronicle.chronicle === 'object') {
      chronicleData = savedChronicle.chronicle as ChronicleJson;
  }

  const finalChronicle = chronicleData?.finalChronicle || null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Generador de Crónica"
          description={`Partido: ${match.teamA.name} vs ${match.teamB.name}`}
        />
        <div className="container mx-auto max-w-4xl p-4 py-8 md:p-8 space-y-8">
            {finalChronicle && savedChronicle && (
              <>
                <SavedChronicle chronicle={savedChronicle} />
                <Separator />
              </>
            )}
            <MatchEventsJson events={match.events} />
            <Separator />
            <ChronicleGenerator 
                match={match} 
                hasExistingChronicle={!!finalChronicle} 
            />
        </div>
      </main>
      <Footer />
    </div>
  );
}
