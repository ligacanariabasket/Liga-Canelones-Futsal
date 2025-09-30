
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/animations';

export function PostCard({ post }: { post: Post }) {
  const imageSrc = post.imageUrl || '/placeholder.png';
  
  return (
    <motion.div
      variants={animationVariants.slideInUp}
       whileHover={{ y: -5, scale: 1.01 }}
       transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="flex flex-col overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-primary/20 w-full group h-full">
        <div className="relative aspect-video">
          <Link href={`/blog/${post.slug}`} className="block h-full" aria-label={`Leer más sobre ${post.title}`}>
            <Image
              src={imageSrc}
              alt={`Imagen para ${post.title}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div className="flex flex-col p-6 bg-card flex-grow">
           <CardHeader className="p-0">
             <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
             </div>
             <CardTitle className="mb-2 text-2xl font-bold leading-tight hover:text-primary">
               <Link href={`/blog/${post.slug}`}>{post.title}</Link>
             </CardTitle>
           </CardHeader>
           <CardContent className="p-0 flex-grow">
             <CardDescription className="text-base text-muted-foreground line-clamp-3">
                 {post.excerpt}
             </CardDescription>
           </CardContent>
           <CardFooter className="p-0 pt-4 mt-auto">
              <Link href={`/blog/${post.slug}`} className="font-semibold text-primary inline-flex items-center group-hover:underline">
                  Leer más <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
           </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
