
'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Vote, MessageSquare, Megaphone } from 'lucide-react';
import { animationVariants } from '@/lib/animations';

const features = [
  {
    icon: <Vote className="h-10 w-10 text-primary" />,
    title: 'Vota en Encuestas',
    description: 'Elige al jugador del partido, opina sobre jugadas polémicas y participa en las decisiones que marcan la diferencia. ¡Tu voz cuenta!',
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: 'Alienta a tu Equipo',
    description: 'Envía mensajes de apoyo, comparte tus cánticos y hazle saber a tu equipo que estás con ellos en cada jugada. ¡La hinchada es el sexto jugador!',
  },
  {
    icon: <Megaphone className="h-10 w-10 text-primary" />,
    title: 'Feedback a la Liga',
    description: 'Ayúdanos a mejorar. Envía tus sugerencias, ideas y comentarios directamente a la organización para que juntos hagamos crecer la liga.',
  },
];

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={animationVariants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={animationVariants.slideInUp}>
              <Card className="h-full text-center p-8 bg-card shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-2">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">{feature.icon}</div>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
