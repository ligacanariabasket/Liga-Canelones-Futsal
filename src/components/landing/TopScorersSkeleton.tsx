import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TopScorersSkeleton() {
  return (
    <div className="w-full">
        <div className="text-center mb-8">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
                <Card key={i} className="text-center">
                    <CardHeader>
                        <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
                        <Skeleton className="h-8 w-16 mx-auto mt-4" />
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
