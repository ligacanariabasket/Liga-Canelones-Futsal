

'use client';

import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/animations';
import { VideoCard, type VideoCardProps } from '@/components/landing/VideoCard';

interface VideoGridProps {
  videos: VideoCardProps['video'][];
}

export function VideoGrid({ videos }: VideoGridProps) {
  return (
    <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={animationVariants.staggerContainer}
        initial="hidden"
        animate="visible"
    >
      {videos.map((video) => (
        <motion.div key={video.id} variants={animationVariants.slideInUp}>
            <VideoCard video={video} />
        </motion.div>
      ))}
    </motion.div>
  );
}
