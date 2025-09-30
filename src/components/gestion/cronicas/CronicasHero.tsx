
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PenSquare } from 'lucide-react';
import { animationVariants } from '@/lib/animations';

export function CronicasHero() {
  return (
    <motion.section 
      className="relative bg-secondary/30 py-16 md:py-24 text-foreground overflow-hidden"
      variants={animationVariants.staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-secondary/20"></div>
      
      <div className="relative container mx-auto px-4 text-center">
        <motion.div variants={animationVariants.slideInUp} className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 border-2 border-primary/20 rounded-full">
                <PenSquare className="h-12 w-12 text-primary" />
            </div>
        </motion.div>
        <motion.h1 
          className="text-5xl md:text-7xl font-bold font-orbitron"
          variants={animationVariants.slideInUp}
        >
          Gestión de Crónicas
        </motion.h1>
        <motion.p 
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
            variants={animationVariants.slideInUp}
        >
            Escribe, edita y publica las crónicas de los partidos más destacados de la liga.
        </motion.p>
      </div>
    </motion.section>
  );
}
