
'use client';

import { useState, useEffect } from 'react';
import { getAllPolls } from '@/actions/poll-actions';
import type { PollWithOptions } from '@/types/poll-types';
import { Skeleton } from '@/components/ui/skeleton';
import { PollCard } from './PollCard';
import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/animations';

function PollsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
        </div>
    )
}

export function PollsSection() {
    const [polls, setPolls] = useState<PollWithOptions[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllPolls().then(data => {
            setPolls(data as PollWithOptions[]);
            setLoading(false);
        })
    }, []);

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                 <motion.div
                    className="text-center mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={animationVariants.staggerContainer}
                >
                    <motion.h2 variants={animationVariants.slideInUp} className="text-3xl font-bold text-primary">Encuestas Activas</motion.h2>
                    <motion.p variants={animationVariants.slideInUp} className="mt-2 text-muted-foreground">Tu opinión es importante. ¡Participa y haz que tu voz se escuche!</motion.p>
                </motion.div>

                {loading ? (
                    <PollsSkeleton />
                ) : polls.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {polls.map(poll => (
                           <PollCard key={poll.id} poll={poll} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground bg-card rounded-lg">
                        <p className="text-lg font-semibold">No hay encuestas disponibles en este momento.</p>
                    </div>
                )}
            </div>
        </section>
    )
}
