
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Team } from '@/types';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from "next/image";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

function TeamCarouselSkeleton() {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    )
}

const TeamItem = ({ team }: { team: Team }) => (
    <Link href={`/clubes/${team.slug}`} className="group flex flex-col items-center gap-2">
        <motion.div
             whileHover={{ y: -5, scale: 1.05 }}
             transition={{ type: "spring", stiffness: 300 }}
             className="w-24 h-24 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center border-2 border-transparent group-hover:border-primary-foreground transition-colors"
        >
            <Image 
                src={team.logoUrl || '/logofu.svg'}
                alt={team.name}
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
            />
        </motion.div>
        <span className="font-semibold text-sm text-center text-primary-foreground/90 group-hover:text-primary-foreground transition-colors">{team.name}</span>
    </Link>
);


interface TeamCarouselProps {
    teams: Team[];
    loading: boolean;
}

export function TeamCarousel({ teams, loading }: TeamCarouselProps) {
    
    const plugin = React.useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true })
    )
    
    if (loading) {
        return (
            <section className="py-20 text-center bg-gradient-to-br from-primary to-accent">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl font-bold font-orbitron text-primary-foreground mb-2">Clubes de la Competición</h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">LIGA CANARIA FUTSAL</p>
                    <TeamCarouselSkeleton />
                </div>
            </section>
        );
    }
    
    if (teams.length === 0) {
        return null;
    }

    return (
        <section id="teams" className="relative py-20 text-center overflow-hidden">
             <div className="absolute inset-0">
                <Image
                    src="/banners/banner_azul2.jpeg"
                    alt="Fondo de la sección de equipos"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-background via-black/80 to-primary/60" />
            </div>
            <div className="relative container px-4 md:px-6">
                 <h2 className="text-3xl font-bold font-orbitron text-primary-foreground mb-2">Clubes de la Competición</h2>
                <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">LIGA CANARIA FUTSAL</p>
                
                <Carousel
                    className="w-full"
                    opts={{
                        align: "start",
                        loop: teams.length > 10,
                    }}
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent className="-ml-4">
                        {teams.map(team => (
                            <CarouselItem key={team.id} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 pl-4">
                               <TeamItem team={team} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex text-primary-foreground bg-primary/50 hover:bg-primary-foreground/20" />
                    <CarouselNext className="hidden md:flex text-primary-foreground bg-primary/50 hover:bg-primary-foreground/20" />
                </Carousel>

                <div className="mt-12 text-center">
                    <Button asChild variant="link" className="text-primary-foreground text-base">
                        <Link href="/clubes">
                            Ver todos los clubes
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
