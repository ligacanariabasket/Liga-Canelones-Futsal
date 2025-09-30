
import type { Team, GameEvent, GameEventType } from '@/types';
import { CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface TeamStatsProps {
    team: Team;
}

const StatRow = ({ label, value }: { label: string, value: number | string }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between py-3 px-4 sm:px-6">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-primary">{value}</p>
    </div>
);

export function TeamStats({ team }: TeamStatsProps) {
    const getTeamEvents = (eventType: GameEventType): GameEvent[] => {
        if (!team.matches) return [];
        return team.matches.flatMap(match =>
            match.events.filter(event =>
                event.type === eventType &&
                (event.teamId === team.id || 
                 (match.teamA.id === team.id && event.teamId === match.teamA.id) || 
                 (match.teamB.id === team.id && event.teamId === match.teamB.id))
            )
        );
    };

    const goals = team.matches?.reduce((acc, match) => {
        if (match.teamA.id === team.id) return acc + (match.scoreA || 0);
        if (match.teamB.id === team.id) return acc + (match.scoreB || 0);
        return acc;
    }, 0) || 0;

    const attackStats = [
        { label: "Goles Totales", value: goals },
        { label: "Disparos", value: getTeamEvents('SHOT').length },
        { label: "Asistencias", value: getTeamEvents('ASSIST').length },
    ];
    
    const teamPlayStats = [
        { label: "Faltas Cometidas", value: getTeamEvents('FOUL').length },
        { label: "Tarjetas Amarillas", value: getTeamEvents('YELLOW_CARD').length },
        { label: "Tarjetas Rojas", value: getTeamEvents('RED_CARD').length },
    ];

    return (
        <CardContent className="p-0">
            <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-bold px-4 sm:px-6">ATAQUE</AccordionTrigger>
                    <AccordionContent className="p-0">
                        <div className="divide-y divide-border">
                            {attackStats.map(stat => (
                                <StatRow key={stat.label} label={stat.label} value={stat.value} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b-0">
                    <AccordionTrigger className="text-lg font-bold px-4 sm:px-6">JUEGO EN EQUIPO</AccordionTrigger>
                    <AccordionContent className="p-0">
                         <div className="divide-y divide-border">
                            {teamPlayStats.map(stat => (
                                <StatRow key={stat.label} label={stat.label} value={stat.value} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    );
}
