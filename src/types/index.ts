

import type { ElementType } from 'react';
import type { Season as PrismaSeason, Match as PrismaMatch, Team as PrismaTeam, Player as PrismaPlayer, GameEvent as PrismaGameEvent, PlayerMatchStats as PrismaPlayerMatchStats, SeasonTeam as PrismaSeasonTeam, Post as PrismaPost, MatchChronicle as PrismaMatchChronicle, Poll as PrismaPoll, PollOption as PrismaPollOption, Vote as PrismaVote } from '@prisma/client';

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'SELECTING_STARTERS'| 'POSTPONED' | 'IN_PROGRESS' ;
export type PlayerPositionType = "GOLERO" | "DEFENSA" | "ALA" | "PIVOT";

export interface Player extends PrismaPlayer {
    position: PlayerPositionType;
    avatarUrl?: string | null;
}

export type PlayerMatchStats = PrismaPlayerMatchStats;

export type Season = PrismaSeason;

export interface SeasonTeam extends Omit<PrismaSeasonTeam, 'team'> {
  // Define any additional properties if needed
}


export interface Team extends Omit<PrismaTeam, 'slug'> {
  slug: string;
  players: Player[];
  matches?: FullMatch[];
  description: string | null;
  bannerUrl: string | null;
  instagram: string | null;
  facebook: string | null;
  whatsapp: string | null;
  phone: string | null;
}

export type SeasonTeamWithTeam = SeasonTeam & {
    team: Team;
    recentResults: ('W' | 'D' | 'L')[];
}

export type GameEventType = 'GOAL' | 'ASSIST' | 'FOUL' | 'SHOT' | 'YELLOW_CARD' | 'RED_CARD' | 'TIMEOUT' | 'SUBSTITUTION' | 'MATCH_START' | 'PERIOD_START' | 'MATCH_END';

export interface GameEvent extends Omit<PrismaGameEvent, 'type'> {
    type: GameEventType;
}

export interface FullMatch extends Omit<PrismaMatch, 'teamAId' | 'teamBId' | 'events' | 'scheduledTime' | 'status' | 'updatedAt'> {
  id: number;
  scheduledTime: string;
  updatedAt: string;
  status: MatchStatus;
  teamA: Team;
  teamB: Team;
  events: GameEvent[];
  playerMatchStats: PlayerMatchStats[];
}

export type PlayerStat = {
  player: Player & { team: Team };
  count: number;
};

export interface PlayerWithStats extends Player {
    goals: number;
    assists: number;
    matchesPlayed: number;
    minutesPlayed: number;
    avgMinutesPerMatch: number;
    team: Team;
}

export interface MatchStats extends FullMatch {
  stats: {
    topScorers: PlayerStat[];
    assistsLeaders: PlayerStat[];
    foulsByPlayer: PlayerStat[];
    shotsByPlayer: PlayerStat[];
  };
}


export type SelectedPlayer = {
  teamId: 'A' | 'B';
  playerId: number;
} | null;

export type PlayerPosition = {
    x: number;
    y: number;
};

export type PlayerTimeTracker = {
    [playerId: number]: {
        startTime: number; // Game clock time when player entered
        totalTime: number; // Accumulated time in seconds
    };
};

export interface GameState {
  matchId: number | null;
  status: MatchStatus;
  teamA: Team | null;
  teamB: Team | null;
  scoreA: number;
  scoreB: number;
  foulsA: number;
  foulsB: number;
  timeoutsA: number;
  timeoutsB: number;
  period: number;
  time: number; // in seconds
  isRunning: boolean;
  events: GameEvent[];
  selectedPlayer: SelectedPlayer;
  substitutionState: {
      playerOut: NonNullable<SelectedPlayer>;
  } | null;
  activePlayersA: number[];
  activePlayersB: number[];
  playerPositions: { [playerId: number]: PlayerPosition };
  playerTimeTracker: PlayerTimeTracker;
  updatedAt: string | null;
}

export interface Post extends Omit<PrismaPost, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}


export interface SocialLink {
  name: string;
  url: string;
  icon?: ElementType;
  imageUrl: string;
  color: string;
  textColor?: string;
}

export type MatchChronicle = PrismaMatchChronicle;

export type Poll = PrismaPoll;
export type PollOption = PrismaPollOption;
export type Vote = PrismaVote;
