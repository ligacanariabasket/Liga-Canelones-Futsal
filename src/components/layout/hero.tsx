
'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy } from 'lucide-react';

export default function Hero() {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-background to-card overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={
                    {
                        backgroundImage: `url('/banners/banner_azul.webp')`
                    }
                }
                data-ai-hint="futsal court">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            </div>

            <div className="relative pt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="flex min-h-screen items-center justify-center text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="max-w-5xl">
                        <motion.div className="relative" variants={itemVariants}>
                             <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight font-orbitron">
                                <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
                                    Liga Canaria Futsal
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p 
                            className="mt-8 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto"
                            variants={itemVariants}
                        >
                            Sigue cada partido, cada gol y cada jugada. La plataforma definitiva para los
                            amantes del fútbol sala en la región.
                        </motion.p>

                        <motion.div 
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                            variants={itemVariants}
                        >
                            <Button asChild size="lg" className="w-full sm:w-auto">
                                <Link href="/partidos" className="group">
                                    Ver Partidos
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>

                            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                                <Link href="/posiciones" className="group">
                                    <Trophy className="mr-2 h-5 w-5 transition-transform group-hover:rotate-[15deg]"/>
                                    Ver Posiciones
                                </Link>
                            </Button>
                        </motion.div>

                    </div>

                </motion.div>
            </div>
        </div>
    )
}
