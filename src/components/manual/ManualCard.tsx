'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { animationVariants } from '@/lib/animations';

interface ManualCardProps {
  section: {
    title: string;
    description: string;
    slug: string;
    icon: React.ReactNode;
  };
}

export function ManualCard({ section }: ManualCardProps) {
  return (
    <motion.div
      variants={animationVariants.slideInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="h-full"
    >
      <Link href={`/manual/${section.slug}`} className="block h-full group">
        <Card className="h-full flex flex-col p-6 overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:border-primary hover:shadow-primary/20 hover:-translate-y-2">
            <CardHeader className="p-0 flex-row items-center gap-4">
                 <div className="p-3 bg-primary/10 rounded-lg">
                    {section.icon}
                </div>
                <CardTitle className="text-xl font-bold">{section.title}</CardTitle>
            </CardHeader>
            <div className="flex-grow pt-4">
              <CardDescription>{section.description}</CardDescription>
            </div>
            <div className="pt-4 mt-auto">
              <span className="font-semibold text-sm text-primary inline-flex items-center">
                Leer más <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
        </Card>
      </Link>
    </motion.div>
  );
}
