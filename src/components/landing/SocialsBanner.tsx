'use client';

import * as React from 'react';
import Autoplay from "embla-carousel-autoplay"
import { socialLinks } from '@/data/social-links';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SocialCard } from './SocialCard';

const BackgroundPattern = () => (
    <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg
            className="absolute left-0 top-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern
                    id="pattern-socials"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                >
                    <path d="M0 0h40v40H0z" fill="none" />
                    <path d="M20 0v40" stroke="white" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern-socials)" />
        </svg>
    </div>
);


export function SocialsBanner() {
    const plugin = React.useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true })
    )

  return (
    <section id="socials" className="relative py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent" />
        <div className="absolute inset-0 bg-black/50" />
        <BackgroundPattern />
        <div className="relative container px-4 md:px-6">
            <h2 className="text-3xl font-bold font-orbitron text-primary-foreground mb-2">Síguenos en Redes</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">Mantente al día con las últimas noticias, resultados y contenido exclusivo.</p>
            
            <Carousel 
              className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {socialLinks.map((link) => (
                    <CarouselItem key={link.name} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                        <div className="p-1 h-full">
                            <SocialCard link={link} />
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
