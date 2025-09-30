
'use client';

import type { SocialLink } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SocialCardProps {
  link: SocialLink;
}

export function SocialCard({ link }: SocialCardProps) {
  const Icon = link.icon;

  return (
    <Link href={link.url} target="_blank" rel="noopener noreferrer" className="block group h-full">
      <motion.div
        whileHover={{ y: -8, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="h-full"
      >
        <Card 
          className="relative flex h-full min-h-[280px] flex-col overflow-hidden shadow-lg transition-shadow duration-300 group-hover:shadow-primary/30 bg-card isolate border-none"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
                src={link.imageUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                aria-hidden="true"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>

          <CardContent className={cn(
            "relative z-10 flex flex-col flex-grow items-center justify-center p-6 text-center transition-colors",
            link.textColor ? link.textColor : 'text-white'
          )}>
              {Icon && <Icon className="w-16 h-16 mb-4 drop-shadow-lg" />}
              <h3 className="text-2xl font-bold drop-shadow-md">{link.name}</h3>
              <div className="mt-2 inline-flex items-center text-sm font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Visitar <ArrowUpRight className="ml-1 h-4 w-4" />
              </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
