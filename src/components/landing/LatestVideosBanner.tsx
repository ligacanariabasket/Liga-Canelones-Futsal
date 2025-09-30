
'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { VideoCard } from './VideoCard';
import { sampleVideos } from '@/data/videos';
import Autoplay from "embla-carousel-autoplay"

const BackgroundPattern = () => (
    <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg
            className="absolute left-0 top-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern
                    id="pattern-videos"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                >
                    <path d="M0 0h40v40H0z" fill="none" />
                    <path d="M20 0v40" stroke="white" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern-videos)" />
        </svg>
    </div>
);

export function LatestVideosBanner() {
    const plugin = React.useRef(
      Autoplay({ delay: 5000, stopOnInteraction: true })
    );

  return (
    <section id="videos" className="relative py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary" />
        <div className="absolute inset-0 bg-black/50" />
        <BackgroundPattern />
      <div className="relative container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-orbitron text-primary-foreground text-left">ÚLTIMOS VIDEOS</h2>
        </div>
        
        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            loop: sampleVideos.length > 4,
          }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-4">
            {sampleVideos.map((video) => (
              <CarouselItem key={video.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                <VideoCard video={video} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
        
         <div className="mt-8 text-left">
            <Button asChild variant="link" className="text-primary-foreground p-0 h-auto font-bold">
                <Link href="#">
                    VER TODOS
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
