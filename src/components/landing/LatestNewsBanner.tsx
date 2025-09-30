
'use client';

import { PostCard } from '../blog/PostCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import type { Post } from '@/types';
import { Skeleton } from '../ui/skeleton';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

function LatestNewsSkeleton() {
    return (
         <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className='space-y-4'>
                <Skeleton className="h-96 w-full rounded-lg" />
                 <Skeleton className="h-6 w-3/4 rounded-lg" />
                 <Skeleton className="h-5 w-1/2 rounded-lg" />
            </div>
            <div className="space-y-4">
                {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-6 w-full" />
                             <Skeleton className="h-6 w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
         </div>
    )
}

const SmallPostCard = ({ post }: { post: Post }) => {
    const imageSrc = post.imageUrl || '/placeholder.png';

    return (
        <Link href={`/blog/${post.slug}`} className="group flex gap-4 items-center">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                <Image 
                    src={imageSrc} 
                    alt={post.title}
                    fill
                    sizes="96px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="flex-grow">
                <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{post.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
            </div>
        </Link>
    )
}

interface LatestNewsBannerProps {
    posts: Post[];
    loading: boolean;
}

export function LatestNewsBanner({ posts, loading }: LatestNewsBannerProps) {
    const featuredPost = posts[0];
    const otherPosts = posts.slice(1, 5);
    

    return (
        <section id="news" className="py-20 text-center bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-primary text-left">Últimas Noticias</h2>
                     <Button asChild variant="link" className="text-primary">
                        <Link href="/blog">
                           Ver todo <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                
                {loading ? <LatestNewsSkeleton /> : posts.length > 0 ? (
                <>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {featuredPost && (
                            <PostCard post={featuredPost} />
                        )}
                        <div className="flex flex-col gap-6">
                            {otherPosts.map(post => (
                                <SmallPostCard key={post.id} post={post} />
                            ))}
                        </div>
                   </div>
                </>
                ) : null}
            </div>
        </section>
    );
}
