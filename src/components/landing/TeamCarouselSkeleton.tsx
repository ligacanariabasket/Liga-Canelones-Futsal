import { Skeleton } from '@/components/ui/skeleton';

export function TeamCarouselSkeleton() {
  return (
    <div className="py-8">
      <div className="flex space-x-4 overflow-hidden">
        {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-16 rounded-full" />
        ))}
      </div>
    </div>
  );
}
