
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/hinchada/Hero';
import { Features } from '@/components/hinchada/Features';
import { PollsSection } from '@/components/hinchada/PollsSection';

export default function HinchadaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <PollsSection />
      </main>
      <Footer />
    </div>
  );
}
