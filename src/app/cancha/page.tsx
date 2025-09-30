
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllMatches } from '@/actions/match-actions';
import type { FullMatch } from '@/types';
import { ArrowRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';


function MatchCard({ match }: { match: FullMatch }) {
    return (
        <Card className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-primary/20">
            <CardHeader>
                <CardTitle className="truncate text-lg">{match.teamA.name} vs {match.teamB.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-around">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Image src={match.teamA.logoUrl || ''} alt={match.teamA.name} width={64} height={64} className="rounded-full aspect-square object-contain"/>
                    <span className="font-semibold text-sm w-24 truncate">{match.teamA.name}</span>
                </div>
                <span className="text-2xl font-bold text-muted-foreground">VS</span>
                 <div className="flex flex-col items-center gap-2 text-center">
                    <Image src={match.teamB.logoUrl || ''} alt={match.teamB.name} width={64} height={64} className="rounded-full aspect-square object-contain"/>
                    <span className="font-semibold text-sm w-24 truncate">{match.teamB.name}</span>
                </div>
            </CardContent>
            <CardFooter className="p-2 bg-muted/50">
                <Button asChild className="w-full">
                    <Link href={`/cancha/${match.id}`}>
                        Abrir Pizarra
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

function MatchList({ matches }: { matches: FullMatch[] }) {
    if (matches.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
                <h3 className="text-xl font-semibold text-muted-foreground">No hay partidos en este estado.</h3>
                <p className="mt-2 text-sm text-muted-foreground">Crea un partido en el panel de gestión para empezar.</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
                <MatchCard key={match.id} match={match} />
            ))}
        </div>
    );
}


function MatchSelectionSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                 <Card key={index} className="bg-muted/50">
                    <CardHeader>
                        <Skeleton className="h-5 w-4/5" />
                    </CardHeader>
                    <CardContent className="flex justify-around items-center">
                        <div className="flex flex-col items-center gap-2">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                         <Skeleton className="h-6 w-10" />
                        <div className="flex flex-col items-center gap-2">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}


export default function CanchaSelectionPage() {
  const [matches, setMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMatches().then(data => {
      setMatches(data);
      setLoading(false);
    });
  }, []);

  const scheduled = matches.filter(m => m.status === 'SCHEDULED');
  const live = matches.filter(m => m.status === 'LIVE');
  const finished = matches.filter(m => m.status === 'FINISHED');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Pizarra Táctica"
          description="Selecciona un partido para analizar formaciones y estrategias."
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
            {loading ? (
                <MatchSelectionSkeleton />
            ) : (
                 <Tabs defaultValue="live" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mx-auto max-w-md">
                        <TabsTrigger value="scheduled">Programados</TabsTrigger>
                        <TabsTrigger value="live">En Vivo</TabsTrigger>
                        <TabsTrigger value="finished">Finalizados</TabsTrigger>
                    </TabsList>
                    <TabsContent value="scheduled" className="mt-6">
                        <MatchList matches={scheduled} />
                    </TabsContent>
                    <TabsContent value="live" className="mt-6">
                        <MatchList matches={live} />
                    </TabsContent>
                    <TabsContent value="finished" className="mt-6">
                        <MatchList matches={finished} />
                    </TabsContent>
                 </Tabs>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
