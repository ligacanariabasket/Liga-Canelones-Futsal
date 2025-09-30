'use client';

import * as React from 'react';
import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Goal, Shield, Hand, Footprints, Square, RefreshCw, Timer } from 'lucide-react';
import type { GameEvent, GameEventType } from '@/types';
import Image from 'next/image';

const eventIcons: Record<GameEventType, React.ReactNode> = {
    GOAL: <Goal className="h-4 w-4 text-green-500" />,
    ASSIST: <Hand className="h-4 w-4 text-blue-500" />,
    SHOT: <Footprints className="h-4 w-4 text-gray-500" />,
    FOUL: <Shield className="h-4 w-4 text-orange-500" />,
    YELLOW_CARD: <Square className="h-4 w-4 text-yellow-500 fill-current" />,
    RED_CARD: <Square className="h-4 w-4 text-red-500 fill-current" />,
    TIMEOUT: <Timer className="h-4 w-4 text-teal-500" />,
    SUBSTITUTION: <RefreshCw className="h-4 w-4 text-cyan-500" />,
    MATCH_START: <></>, // Not shown here
    PERIOD_START: <></>, // Not shown here
    MATCH_END: <></>, // Not shown here
};

const formatTimestamp = (timestamp: number) => {
    const gameDurationPerPeriod = 1200;
    if (timestamp > gameDurationPerPeriod) {
        // First period
        const secondsIntoPeriod = timestamp - gameDurationPerPeriod;
        const minutes = 20 - Math.floor(secondsIntoPeriod / 60);
        return `1T ${minutes}'`;
    } else {
        // Second period
        const minutes = 20 - Math.floor(timestamp / 60);
        return `2T ${minutes}'`;
    }
};

const EventItem = ({ event }: { event: GameEvent }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 p-2 bg-muted/50 rounded-md text-sm"
        >
            {eventIcons[event.type]}
            <span className="font-semibold truncate">{event.playerName}</span>
            <span className="text-muted-foreground ml-auto">{event.type}</span>
            <span className="font-mono text-xs text-muted-foreground">{formatTimestamp(event.timestamp)}</span>
        </motion.div>
    );
};

const TeamEventLog = ({ teamId, title }: { teamId: number, title: string }) => {
    const { state } = useGame();
    const teamEvents = state.events.filter(e => e.teamId === teamId).sort((a,b) => b.timestamp - a.timestamp);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                     <Image src={state.teamA?.id === teamId ? state.teamA.logoUrl || '' : state.teamB?.logoUrl || ''} alt={title} width={24} height={24} />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64 pr-4">
                    <div className="space-y-2">
                        {teamEvents.length > 0 ? (
                            teamEvents.map((event, index) => <EventItem key={`${event.id}-${index}`} event={event} />)
                        ) : (
                            <p className="text-muted-foreground text-center pt-8 text-sm">Sin eventos registrados.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export function EventLog() {
    const { state } = useGame();
    const { teamA, teamB } = state;

    if (!teamA || !teamB) return null;

    return (
        <div className="mt-8">
             <h2 className="text-2xl font-bold text-center mb-4 text-primary">Registro de Eventos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TeamEventLog teamId={teamA.id} title={teamA.name} />
                <TeamEventLog teamId={teamB.id} title={teamB.name} />
            </div>
        </div>
    );
}
