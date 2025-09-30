import { Suspense } from 'react';
import { Footer } from '@/components/layout/footer';
import { LiveMatchesBanner } from '@/components/landing/LiveMatchesBanner';
import { Header } from '@/components/layout/header';
import Hero from '@/components/layout/hero';
import { SocialsBanner } from '@/components/landing/SocialsBanner';
import { HinchadaBanner } from '@/components/landing/HinchadaBanner';
import { LandingTwoColumn } from '@/components/landing/LandingTwoColumn';
import { LatestVideosBanner } from '@/components/landing/LatestVideosBanner';
import { LandingAnimation } from '@/components/landing/LandingAnimation';

// Skeletons
import { FinishedMatchesSkeleton } from '@/components/landing/FinishedMatchesSkeleton';
import { StandingsWidgetSkeleton } from '@/components/landing/StandingsWidgetSkeleton';
import { TopScorersSkeleton } from '@/components/landing/TopScorersSkeleton';
import { LatestNewsBannerSkeleton } from '@/components/landing/LatestNewsBannerSkeleton';
import { TeamCarouselSkeleton } from '@/components/landing/TeamCarouselSkeleton';
import { LatestChroniclesBannerSkeleton } from '@/components/landing/LatestChroniclesBannerSkeleton';

// Data Components
import { FinishedMatchesData } from '@/components/landing/FinishedMatchesData';
import { StandingsWidgetData } from '@/components/landing/StandingsWidgetData';
import { TopScorersData } from '@/components/landing/TopScorersData';
import { LatestNewsBannerData } from '@/components/landing/LatestNewsBannerData';
import { TeamCarouselData } from '@/components/landing/TeamCarouselData';
import { LatestChroniclesBannerData } from '@/components/landing/LatestChroniclesBannerData';


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Hero />
      <LandingAnimation>
        <Suspense fallback={<TeamCarouselSkeleton />}>
          <TeamCarouselData />
        </Suspense>
        <LiveMatchesBanner />
        <LandingTwoColumn
          left={
            <Suspense fallback={<FinishedMatchesSkeleton />}>
              <FinishedMatchesData />
            </Suspense>
          }
          right={
            <Suspense fallback={<StandingsWidgetSkeleton />}>
              <StandingsWidgetData />
            </Suspense>
          }
        />
        <Suspense fallback={<TopScorersSkeleton />}>
            <TopScorersData />
        </Suspense>
        <Suspense fallback={<LatestNewsBannerSkeleton />}>
            <LatestNewsBannerData />
        </Suspense>
        <LatestVideosBanner />
        <Suspense fallback={<LatestChroniclesBannerSkeleton />}>
            <LatestChroniclesBannerData />
        </Suspense>
       
        <HinchadaBanner />
        <SocialsBanner />
      </LandingAnimation>
      <Footer />
    </div>
  );
}

    