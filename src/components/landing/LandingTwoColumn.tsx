
'use client';

import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/animations';
import Image from 'next/image';

interface LandingTwoColumnProps {
    left: React.ReactNode;
    right: React.ReactNode;
}

export function LandingTwoColumn({ left, right }: LandingTwoColumnProps) {
    return (
        <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0">
                <Image 
                    src="/optimas/banners/banner_azul2.webp"
                    alt="Fondo de la sección"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40" />
            </div>

            <div className="container relative px-4 md:px-6">
                 <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                    variants={animationVariants.staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                 >
                    <motion.div variants={animationVariants.slideInUp}>
                        {left}
                    </motion.div>
                     <motion.div variants={animationVariants.slideInUp}>
                        {right}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
