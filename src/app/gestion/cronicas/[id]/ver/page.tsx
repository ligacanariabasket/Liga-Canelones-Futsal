
import { notFound } from 'next/navigation';
import { getChronicleByMatchId, getMatchById } from '@/actions/match-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChronicleHero } from '@/components/gestion/cronicas/ChronicleHero';
import { ChronicleViewer } from '@/components/gestion/cronicas/ChronicleViewer';
import type { MatchChronicle } from '@/types';
import type { GenerateMatchChronicleOutput } from '@/types/genkit-types';

interface ViewChroniclePageProps {
  params: { id: string };
}

export default async function ViewChroniclePage({ params }: ViewChroniclePageProps) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const [chronicle, match] = await Promise.all([
    getChronicleByMatchId(id),
    getMatchById(id)
  ]);

  if (!chronicle || !match) {
    notFound();
  }

  let finalChronicle: GenerateMatchChronicleOutput | null = null;
  try {
      if (chronicle.chronicle && typeof chronicle.chronicle === 'object') {
          const chronicleObject = chronicle.chronicle as { finalChronicle?: any };
          if (chronicleObject.finalChronicle) {
            if (typeof chronicleObject.finalChronicle === 'string') {
              finalChronicle = JSON.parse(chronicleObject.finalChronicle);
            } else {
              finalChronicle = chronicleObject.finalChronicle;
            }
          }
      }
  } catch (e) {
      console.error("Failed to parse chronicle JSON:", e);
      // No llamar a notFound() aquí, puede que solo el JSON esté mal pero el resto es válido.
      // El componente ChronicleViewer manejará el estado nulo.
  }

  if (!finalChronicle) {
      // Si no hay crónica final, podrías redirigir o mostrar un mensaje.
      // Por ahora, mostraremos un mensaje dentro de la página.
      return (
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1 pt-[var(--header-height)]">
            <ChronicleHero 
                match={match}
                title="Cronica no disponible"
            />
            <div className="container mx-auto max-w-4xl p-4 py-8 md:p-8">
                <p className="text-center text-muted-foreground">Aun no se ha generado una cronica final para este partido.</p>
            </div>
          </main>
          <Footer />
        </div>
      );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <ChronicleHero 
            match={match}
            title={finalChronicle.title}
        />
        <div className="container mx-auto max-w-4xl p-4 py-8 md:p-8">
            <ChronicleViewer chronicle={chronicle as MatchChronicle} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
