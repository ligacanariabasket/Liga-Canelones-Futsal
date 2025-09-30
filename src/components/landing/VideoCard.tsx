

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

export interface VideoCardProps {
  video: {
    id: number;
    title: string;
    thumbnailUrl: string;
    duration: string;
    category: string;
    url: string;
  };
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <Link href={video.url} target="_blank" rel="noopener noreferrer" className="block group h-full">
        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-4 text-white w-full">
            <h3 className="text-lg font-bold leading-tight line-clamp-3">{video.title}</h3>
            <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary rounded-full text-sm font-bold text-primary-foreground">
                    <Play className="h-4 w-4 fill-current" />
                    <span>{video.duration}</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">{video.category}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
