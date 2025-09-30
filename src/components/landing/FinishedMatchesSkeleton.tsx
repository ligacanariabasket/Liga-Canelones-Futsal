import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function FinishedMatchesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex flex-col h-full overflow-hidden">
          <CardHeader className="p-3">
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="flex-grow p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-8" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-8" />
            </div>
          </CardContent>
          <CardFooter className="p-2">
             <Skeleton className="h-8 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
