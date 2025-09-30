
'use client';

import type { FullMatch } from '@/types';
import { IngresoMatchCard } from './IngresoMatchCard';

export function MatchList({ matches }: { matches: FullMatch[] }) {
    if (matches.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
                <h3 className="text-xl font-semibold text-muted-foreground">No hay partidos en este estado.</h3>
                <p className="mt-2 text-sm text-muted-foreground">No hay partidos disponibles para la carga manual de datos.</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
                <IngresoMatchCard key={match.id} match={match} />
            ))}
        </div>
    );
}
