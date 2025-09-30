
'use client';

import type { Team } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const slug = team.slug || team.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="h-full"
    >
      <Link href={`/clubes/${slug}`} className="block h-full group">
        <Card className="relative flex flex-col h-full overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-primary/20 isolate border-none aspect-[3/4]">
          
          {/* Blurred background logo */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src={team.logoUrl || '/logofu.svg'}
              alt=""
              fill
              className="object-cover scale-150 blur-lg opacity-20 transition-transform duration-500 group-hover:scale-[1.6]"
              aria-hidden="true"
            />
             <div className={cn(
              "absolute inset-0 z-10",
              "bg-gradient-to-t from-background via-background/80 to-background/20"
            )}></div>
          </div>

          <div className="relative z-20 flex flex-col h-full p-4">
              <div className="flex-grow flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-4/5"
                >
                  <Image
                    src={team.logoUrl || '/logofu.svg'}
                    alt={`Logo de ${team.name}`}
                    width={128}
                    height={128}
                    className="w-full h-auto aspect-square object-contain drop-shadow-lg"
                  />
                </motion.div>
              </div>

              <div className="flex-shrink-0 mt-auto">
                <div className="p-2 bg-black/20 backdrop-blur-sm rounded-md">
                    <p className="text-center font-bold text-white truncate text-sm md:text-base">{team.name}</p>
                </div>
              </div>
          </div>

        </Card>
      </Link>
    </motion.div>
  );
}
