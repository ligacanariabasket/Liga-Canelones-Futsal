'use client';

import { ControlsPanel } from './ControlsPanel';
import { useGame } from '@/contexts/GameProvider';
import { CombinedTeamPanel } from './CombinedTeamPanel';

export function GameControls() {
  const { state } = useGame();
  
  if (!state.teamA || !state.teamB) {
      return null;
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 h-full">
      <div className="lg:col-span-2">
        <CombinedTeamPanel />
      </div>
      <div className="lg:col-span-1 flex flex-col gap-4">
        <ControlsPanel />
      </div>
    </div>
  );
}
