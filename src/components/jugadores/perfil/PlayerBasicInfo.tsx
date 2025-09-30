
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Player } from '@/types';
import { calculateAge } from '@/lib/utils';


interface PlayerBasicInfoProps {
    player: Player;
}

const StatRow = ({ label, value, unit }: { label: string; value: string | number | null | undefined; unit?: string }) => {
    if (value === null || value === undefined) {
        return null;
    }
    return (
        <div className="flex items-baseline justify-between px-6 py-4">
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold text-red-500">
                {value} <span className="text-lg text-muted-foreground">{unit}</span>
            </p>
        </div>
    );
}

export function PlayerBasicInfo({ player }: PlayerBasicInfoProps) {
    const age = player.birthDate ? calculateAge(new Date(player.birthDate)) : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Información Básica
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y">
                <StatRow label="EDAD:" value={age} />
                <StatRow label="ALTURA:" value={player.height} unit="CM" />
                <StatRow label="PESO:" value={player.weight} unit="KG" />
            </CardContent>
        </Card>
    )
}
