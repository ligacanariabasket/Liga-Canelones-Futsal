
'use client';

import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import { animationVariants } from '@/lib/animations';

export function Hero() {
  return (
    <motion.section
      className="relative bg-secondary/30 py-20 md:py-28 text-foreground overflow-hidden"
      variants={animationVariants.staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-secondary/20"></div>

      <div className="relative container mx-auto px-4 text-center">
        <motion.div variants={animationVariants.slideInUp} className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 border-2 border-primary/20 rounded-full">
                <Megaphone className="h-12 w-12 text-primary" />
            </div>
        </motion.div>
        <motion.h1
          className="text-5xl md:text-7xl font-bold font-orbitron"
          variants={animationVariants.slideInUp}
        >
          Espacio de la Hinchada
        </motion.h1>
        <motion.p
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
            variants={animationVariants.slideInUp}
        >
            Tu lugar para participar, votar por el jugador del partido y ser parte de la comunidad de la Liga Canaria de Futsal.
        </motion.p>
      </div>
    </motion.section>
  );
}
