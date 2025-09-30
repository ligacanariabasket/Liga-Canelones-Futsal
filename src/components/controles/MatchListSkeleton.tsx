import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export function MatchListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="bg-secondary/50 transition-opacity duration-300">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-around items-center">
              <div className="flex flex-col items-center gap-2 w-24">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-8" />
              <div className="flex flex-col items-center gap-2 w-24">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-border">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-card-foreground/5">
             <div className="flex gap-2 w-full justify-end">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
