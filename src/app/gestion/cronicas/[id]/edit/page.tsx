
import { notFound } from 'next/navigation';
import { getChronicleByMatchId, getMatchById } from '@/actions/match-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { EditChronicleForm } from '@/components/gestion/cronicas/EditChronicleForm';
import type { MatchChronicle } from '@/types';
import type { GenerateMatchChronicleOutput } from '@/types/genkit-types';

interface EditChroniclePageProps {
  params: {
    id: string;
  };
}

export default async function EditChroniclePage({ params }: EditChroniclePageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const chronicle = await getChronicleByMatchId(id);
  const match = await getMatchById(id);

  if (!chronicle || !match) {
    notFound();
  }

  let finalChronicleData: GenerateMatchChronicleOutput | null = null;
  if (chronicle.chronicle && typeof chronicle.chronicle === 'object') {
    const chronicleJson = chronicle.chronicle as { finalChronicle?: any };
    if (chronicleJson.finalChronicle) {
       finalChronicleData = typeof chronicleJson.finalChronicle === 'string' 
            ? JSON.parse(chronicleJson.finalChronicle) 
            : chronicleJson.finalChronicle;
    }
  }

  if (!finalChronicleData) {
      notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Editar Cronica"
          description={`Partido: ${match.teamA.name} vs ${match.teamB.name}`}
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
            <EditChronicleForm initialChronicleData={finalChronicleData} chronicleId={chronicle.id} matchId={match.id}/>
        </div>
      </main>
      <Footer />
    </div>
  );
}
