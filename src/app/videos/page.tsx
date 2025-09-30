
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageHero } from '@/components/layout/PageHero';
import { VideoGrid } from '@/components/videos/VideoGrid';
import { sampleVideos } from '@/data/videos';
import { Tv } from 'lucide-react';

export default function VideosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Videoteca de la Liga"
          description="Resúmenes, goles, entrevistas y el mejor contenido audiovisual de la Liga Canaria de Futsal."
          icon={<Tv className="h-12 w-12 text-primary" />}
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
            <VideoGrid videos={sampleVideos} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
