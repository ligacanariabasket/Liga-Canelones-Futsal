

'use client';

import { useState } from 'react';
import type { Season, Team } from '@/types';
import { CreateSeasonForm } from './CreateSeasonForm';
import { TeamSelection } from './TeamSelection';
import { FixtureGeneration } from './FixtureGeneration';
import { CheckCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'SEASON' | 'TEAMS' | 'FIXTURE';

interface SeasonSetupProps {
  allTeams: Team[];
}

const StepIndicator = ({ label, isCompleted, isActive }: { label: string, isCompleted: boolean, isActive: boolean }) => (
  <div className="flex items-center gap-2">
    <div className={cn(
      "h-6 w-6 rounded-full flex items-center justify-center transition-colors",
      isCompleted ? "bg-green-500 text-white" : isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
    )}>
      {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
    </div>
    <span className={cn(
      "font-semibold transition-colors",
      isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
    )}>{label}</span>
  </div>
);

export function SeasonSetup({ allTeams }: SeasonSetupProps) {
  const [step, setStep] = useState<Step>('SEASON');
  const [season, setSeason] = useState<Season | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

  const handleSeasonCreated = (newSeason: Season) => {
    setSeason(newSeason);
    setStep('TEAMS');
  };

  const handleTeamsConfirmed = (teams: Team[]) => {
    setSelectedTeams(teams);
    setStep('FIXTURE');
  };
  
  const getStepContent = (currentStep: Step): string => {
      switch(currentStep) {
          case 'SEASON':
              return "Dale un nombre a tu nueva temporada para empezar.";
          case 'TEAMS':
              return "Selecciona los equipos que participarán en esta temporada.";
          case 'FIXTURE':
              return "Guarda los equipos y genera el calendario de partidos.";
          default:
              return "";
      }
  }


  return (
    <div className="space-y-8">
      {/* Step 1: Create Season */}
      <section>
        <StepIndicator label="Paso 1: Crear Temporada" isCompleted={!!season} isActive={step === 'SEASON'} />
        <div className="pl-8 mt-2 border-l-2 border-dashed ml-3 pb-6 border-border">
          <div className="pl-4">
             <p className="text-sm text-muted-foreground mb-4">{getStepContent('SEASON')}</p>
             <CreateSeasonForm
              onSeasonCreated={handleSeasonCreated}
              isDisabled={step !== 'SEASON'}
            />
          </div>
        </div>
      </section>

      {/* Step 2: Select Teams */}
      <section className={cn(step === 'SEASON' && 'opacity-50 pointer-events-none')}>
         <StepIndicator label="Paso 2: Seleccionar Equipos" isCompleted={step === 'FIXTURE'} isActive={step === 'TEAMS'} />
         <div className="pl-8 mt-2 border-l-2 border-dashed ml-3 pb-6 border-border">
          <div className="pl-4">
             <p className="text-sm text-muted-foreground mb-4">{getStepContent('TEAMS')}</p>
            <TeamSelection
              allTeams={allTeams}
              isDisabled={step !== 'TEAMS'}
              season={season}
              onTeamsConfirmed={handleTeamsConfirmed}
            />
          </div>
        </div>
      </section>

      {/* Step 3: Generate Fixture */}
      <section className={cn(step !== 'FIXTURE' && 'opacity-50 pointer-events-none')}>
         <StepIndicator label="Paso 3: Generar Fixture" isCompleted={false} isActive={step === 'FIXTURE'} />
        <div className="pl-8 mt-2 ml-3">
            <div className="pl-4">
                 <p className="text-sm text-muted-foreground mb-4">{getStepContent('FIXTURE')}</p>
                 <FixtureGeneration
                    isDisabled={step !== 'FIXTURE'}
                    season={season}
                    selectedTeams={selectedTeams}
                />
            </div>
        </div>
      </section>
    </div>
  );
}
