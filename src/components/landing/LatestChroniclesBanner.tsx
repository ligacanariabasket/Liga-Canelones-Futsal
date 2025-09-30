
'use client';

import * as React from 'react';
import { Skeleton } from '../ui/skeleton';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ChronicleCard } from './ChronicleCard';
import type { FullMatch, MatchChronicle } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

function LatestChroniclesSkeleton() {
    return (
         <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-96 w-full hidden md:block rounded-lg" />
            <Skeleton className="h-96 w-full hidden lg:block rounded-lg" />
         </div>
    )
}

interface LatestChroniclesBannerProps {
    chronicles: (MatchChronicle & { match: FullMatch })[];
}

export function LatestChroniclesBanner({ chronicles }: LatestChroniclesBannerProps) {
    const plugin = React.useRef(
      Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    if (chronicles.length === 0) {
        return null; // Do not render if there are no chronicles
    }

    return (
        <section id="chronicles" className="py-20 text-center bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-primary text-left">Crónicas Destacadas</h2>
                     <Button asChild variant="link" className="text-primary">
                        <Link href="/gestion/cronicas">
                           Ver todas <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                
                <Carousel 
                  className="w-full"
                  opts={{
                    align: "start",
                    loop: chronicles.length > 3,
                  }}
                  plugins={[plugin.current]}
                  onMouseEnter={plugin.current.stop}
                  onMouseLeave={plugin.current.reset}
                >
                  <CarouselContent className="-ml-4">
                    {chronicles.map((chronicle) => (
                      <CarouselItem key={chronicle.id} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4">
                        <ChronicleCard chronicle={chronicle} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
            </div>
        </section>
    );
}

    