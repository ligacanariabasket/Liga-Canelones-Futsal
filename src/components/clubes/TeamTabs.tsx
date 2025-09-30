
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamStats } from './TeamStats';
import { TeamPlayers } from './TeamPlayers';
import { TeamSchedule } from './TeamSchedule';
import type { Team } from '@/types';
import { Users, BarChart2, CalendarDays } from 'lucide-react';

interface TeamTabsProps {
    team: Team;
}

export function TeamTabs({ team }: TeamTabsProps) {
    return (
        <div className="container mx-auto max-w-6xl -mt-10 pb-12 relative z-10">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                <Tabs defaultValue="players" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 p-0 h-auto rounded-none bg-gradient-to-r from-primary/80 to-accent/80">
                        <TabsTrigger value="stats" className="text-white font-semibold flex-1 flex items-center gap-2 py-4 rounded-none data-[state=active]:bg-black/20 data-[state=active]:shadow-inner hover:bg-black/10 transition-colors duration-300">
                            <BarChart2 className="h-5 w-5" />
                            Estadísticas
                        </TabsTrigger>
                        <TabsTrigger value="players" className="text-white font-semibold flex-1 flex items-center gap-2 py-4 rounded-none data-[state=active]:bg-black/20 data-[state=active]:shadow-inner hover:bg-black/10 transition-colors duration-300">
                             <Users className="h-5 w-5" />
                            Jugadores
                        </TabsTrigger>
                        <TabsTrigger value="schedule" className="text-white font-semibold flex-1 flex items-center gap-2 py-4 rounded-none data-[state=active]:bg-black/20 data-[state=active]:shadow-inner hover:bg-black/10 transition-colors duration-300">
                            <CalendarDays className="h-5 w-5" />
                            Calendario
                        </TabsTrigger>
                    </TabsList>
                    <div className="p-2 sm:p-4 md:p-6">
                        <TabsContent value="stats" className="mt-0">
                            <TeamStats team={team} />
                        </TabsContent>
                        <TabsContent value="players" className="mt-0">
                            <TeamPlayers team={team} />
                        </TabsContent>
                        <TabsContent value="schedule" className="mt-0">
                            <TeamSchedule matches={team.matches || []} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
