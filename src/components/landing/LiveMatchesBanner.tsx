
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LiveMatchCard } from './LiveMatchCard';
import type { FullMatch } from '@/types';
import { getAllMatches } from '@/actions/match-actions';
import { Skeleton } from '../ui/skeleton';
import Autoplay from "embla-carousel-autoplay"


function LiveMatchesSkeleton() {
    return (
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Skeleton className="h-44 w-full rounded-lg" />
                 <Skeleton className="h-44 w-full hidden sm:block rounded-lg" />
                 <Skeleton className="h-44 w-full hidden lg:block rounded-lg" />
            </div>
        </div>
    )
}

export function LiveMatchesBanner() {
  const [liveMatches, setLiveMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  useEffect(() => {
    const fetchMatches = () => {
        getAllMatches().then(matches => {
            setLiveMatches(matches.filter(m => m.status === 'LIVE'));
            setLoading(false);
        });
    }
    
    fetchMatches();
    const interval = setInterval(fetchMatches, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if(loading) {
    return (
      <section id="live-matches" className="w-full py-12 md:py-20 bg-muted/40">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold font-orbitron text-center mb-8 text-primary">Sigue la Acción en Vivo</h2>
          <LiveMatchesSkeleton />
        </div>
      </section>
    )
  }

  if (liveMatches.length === 0) {
      return null;
  }

  return (
    <section id="live-matches" className="w-full py-12 md:py-20 bg-muted/40">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold font-orbitron text-center mb-8 text-primary">Sigue la Acción en Vivo</h2>
        <Carousel 
          className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto"
          opts={{
            align: "start",
            loop: liveMatches.length > 3,
          }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {liveMatches.map((match) => (
              <CarouselItem key={match.id} className="sm:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <LiveMatchCard match={match} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
