'use client';

import { useEffect, useState } from 'react';
import { getPosts } from '@/actions/blog-actions';
import { PostCard } from '@/components/blog/PostCard';
import type { Post } from '@/types';
import { Skeleton } from '../ui/skeleton';

function BlogPageSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
        </div>
    );
}

export function BlogPageContent() {
  const [postsData, setPostsData] = useState<{ posts: Post[], totalPages: number }>({ posts: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts().then(data => {
      setPostsData(data);
      setLoading(false);
    });
  }, []);

  const { posts } = postsData;

  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
        {loading ? (
            <BlogPageSkeleton />
        ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
                <h3 className="text-xl font-semibold text-muted-foreground">No hay publicaciones disponibles.</h3>
                <p className="mt-2 text-sm text-muted-foreground">Por favor, vuelve a intentarlo más tarde.</p>
            </div>
        )}
    </div>
  );
}
