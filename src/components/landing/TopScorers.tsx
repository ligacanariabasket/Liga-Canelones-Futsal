'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlayerScoreCard } from './PlayerScoreCard';
import type { PlayerWithStats } from '@/types';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';


function TopScorersSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="aspect-[3/4] w-full rounded-lg" />
            ))}
        </div>
    )
}

interface TopScorersProps {
    players: PlayerWithStats[];
    loading: boolean;
}


export function TopScorers({ players, loading }: TopScorersProps) {
    
    const topScorers = useMemo(() => {
        return players
            .filter(p => p.goals > 0)
            .sort((a, b) => b.goals - a.goals)
            .slice(0, 5);
    }, [players]);

    if (loading) {
        return (
            <section className="w-full py-20 bg-primary text-primary-foreground">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl font-black uppercase mb-1">Goleadores de Temporada</h2>
                    <p className="text-primary-foreground/80 mb-8">LIGA CANARIA FUTSAL</p>
                    <TopScorersSkeleton />
                </div>
            </section>
        );
    }
    
    if (topScorers.length === 0) {
        return null; // Don't render the section if there are no scorers
    }

    return (
        <section className="relative w-full py-12 md:py-20 text-primary-foreground">
            <div className="absolute inset-0 bg-primary" />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative container px-4 md:px-6">
                <h2 className="text-3xl font-black uppercase mb-1">Goleadores de Temporada</h2>
                <p className="text-primary-foreground/80 mb-8">LIGA CANARIA FUTSAL</p>
                
                <Carousel
                    className="w-full"
                    opts={{
                        align: "start",
                        loop: topScorers.length > 5,
                    }}
                >
                    <CarouselContent className="-ml-4">
                        {topScorers.map(player => (
                            <CarouselItem key={player.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4">
                               <PlayerScoreCard player={player} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex text-primary-foreground bg-primary/80 hover:bg-primary/100" />
                    <CarouselNext className="hidden sm:flex text-primary-foreground bg-primary/80 hover:bg-primary/100" />
                </Carousel>

                <div className="mt-8 text-center">
                    <Button asChild variant="link" className="text-primary-foreground text-base">
                        <Link href="/jugadores">
                            Ver Ranking Completo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
