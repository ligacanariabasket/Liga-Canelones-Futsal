
'use client';

import type { Team } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamSelectItem } from './TeamSelectItem';
import { Users, Inbox } from 'lucide-react';

interface DroppableTeamListProps {
  teams: Team[];
  onRemoveTeam: (team: Team) => void;
}

export function DroppableTeamList({ teams, onRemoveTeam }: DroppableTeamListProps) {
  return (
    <Card className="h-full bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Equipos Seleccionados ({teams.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="h-96 overflow-y-auto p-2">
        {teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
            <Inbox className="h-10 w-10 mb-2" />
            <p className="font-semibold">Añade equipos aquí</p>
            <p className="text-sm">Selecciona equipos de la lista de disponibles.</p>
          </div>
        ) : (
          <AnimatePresence>
            {teams.map((team) => (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="m-1"
              >
                <TeamSelectItem
                  team={team}
                  onSelect={() => onRemoveTeam(team)}
                  isSelected={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
