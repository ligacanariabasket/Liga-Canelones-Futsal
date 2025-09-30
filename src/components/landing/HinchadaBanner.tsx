
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Megaphone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/animations';

export function HinchadaBanner() {
  return (
    <motion.section 
        className="relative py-20 bg-cover bg-center text-white" 
        style={{ backgroundImage: "url('/optimas/stadium-bg.webp')" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animationVariants.staggerContainer}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div className="relative container mx-auto px-4 text-center">
        <motion.div variants={animationVariants.slideInUp} className="flex justify-center mb-4">
            <div className="p-4 bg-primary/20 border-2 border-primary/30 rounded-full">
                <Megaphone className="h-10 w-10 text-primary" />
            </div>
        </motion.div>
        <motion.h2 
            className="text-3xl md:text-4xl font-bold font-orbitron"
            variants={animationVariants.slideInUp}
        >
            Tu Voz, Tu Pasión
        </motion.h2>
        <motion.p 
            className="mt-4 max-w-2xl mx-auto text-lg text-white/80"
            variants={animationVariants.slideInUp}
        >
            Participa en encuestas, elige al jugador del partido y haz que tu opinión cuente en la comunidad de la Liga Canaria de Futsal.
        </motion.p>
        <motion.div className="mt-8" variants={animationVariants.slideInUp}>
            <Button asChild size="lg">
                <Link href="/hinchada">
                    Ir al Espacio de la Hinchada
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
