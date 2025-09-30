
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/animations';
import type { FullMatch, MatchChronicle } from '@/types';
import { formatDate } from '@/lib/utils';
import type { GenerateMatchChronicleOutput } from '@/types/genkit-types';
import { cn } from '@/lib/utils';

type ChronicleCardProps = {
  chronicle: MatchChronicle & { match: FullMatch };
};

const TeamDisplay = ({ team }: { team: FullMatch['teamA'] }) => (
    <div className="flex flex-col items-center gap-2 text-center w-24">
        <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 relative"
        >
            <Image 
                src={team.logoUrl || '/logofu.svg'} 
                alt={team.name}
                fill
                className="object-contain"
            />
        </motion.div>
        <span className="font-bold text-white text-sm truncate">{team.name}</span>
    </div>
);


export function ChronicleCard({ chronicle }: ChronicleCardProps) {
  const { match, chronicle: chronicleData, createdAt } = chronicle;
  
  let parsedChronicle: GenerateMatchChronicleOutput;
  if (typeof chronicleData === 'string') {
    try {
      parsedChronicle = JSON.parse(chronicleData);
    } catch {
      parsedChronicle = { title: 'Crónica no disponible', excerpt: '', matchStatsSummary: '', chronicleBody: '' };
    }
  } else {
    parsedChronicle = chronicleData as GenerateMatchChronicleOutput;
  }

  const imageSrc = (match.teamA.bannerUrl || match.teamB.bannerUrl || '/banner_youtube.jpg').replace(/\.(jpg|jpeg|png)$/, '.webp');
  const finalImageSrc = imageSrc.startsWith('/optimas') ? imageSrc : `/optimas${imageSrc}`;

  const isTeamAWinner = match.scoreA > match.scoreB;
  const isTeamBWinner = match.scoreB > match.scoreA;

  return (
    <motion.div
      variants={animationVariants.slideInUp}
       whileHover={{ y: -5, scale: 1.01 }}
       transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="flex flex-col overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-primary/20 w-full group h-full">
        <div className="relative aspect-video">
          <Link href={`/gestion/cronicas/${match.id}/ver`} className="block h-full" aria-label={`Leer más sobre ${parsedChronicle.title}`}>
            <Image
              src={finalImageSrc}
              alt={`Imagen del partido ${match.teamA.name} vs ${match.teamB.name}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end">
                <div className="w-full p-4 bg-black/10 backdrop-blur-sm">
                    <div className="grid grid-cols-3 items-center gap-2">
                        <TeamDisplay team={match.teamA} />
                        <div className="text-center font-black text-white text-3xl md:text-4xl flex items-center justify-center gap-2">
                            <span className={cn(isTeamAWinner && "text-green-400")}>{match.scoreA}</span>
                            <span>-</span>
                            <span className={cn(isTeamBWinner && "text-green-400")}>{match.scoreB}</span>
                        </div>
                        <TeamDisplay team={match.teamB} />
                    </div>
                </div>
           </div>
        </div>
        <div className="flex flex-col p-6 bg-card flex-grow">
           <CardHeader className="p-0">
             <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDate(createdAt.toString())}</span>
             </div>
             <CardTitle className="mb-2 text-2xl font-bold leading-tight hover:text-primary">
               <Link href={`/gestion/cronicas/${match.id}/ver`}>{parsedChronicle.title}</Link>
             </CardTitle>
           </CardHeader>
           <CardContent className="p-0 flex-grow">
             <CardDescription className="text-base text-muted-foreground line-clamp-3">
                 {parsedChronicle.excerpt}
             </CardDescription>
           </CardContent>
           <CardFooter className="p-0 pt-4 mt-auto">
              <Link href={`/gestion/cronicas/${match.id}/ver`} className="font-semibold text-primary inline-flex items-center group-hover:underline">
                  Leer crónica completa <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
           </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
