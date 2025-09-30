'use client';

import type { Team } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamListProps {
  teams: Team[];
}

export function TeamList({ teams }: TeamListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {teams.map(team => (
        <motion.div
          key={team.id}
          whileHover={{ y: -4 }}
          className="h-full"
        >
          <Link href={`/gestion/jugadores/equipo/${team.slug}`} className="block h-full group">
            <div className="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg h-full transition-colors hover:bg-muted/50 hover:border-primary">
                <Image
                    src={team.logoUrl || '/logofu.svg'}
                    alt={`Logo de ${team.name}`}
                    width={48}
                    height={48}
                    className="w-12 h-12 aspect-square object-contain transition-transform group-hover:scale-110"
                />
                <p className="text-center font-semibold text-sm text-foreground truncate w-full">{team.name}</p>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground group-hover:text-primary">
                    Gestionar
                    <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
