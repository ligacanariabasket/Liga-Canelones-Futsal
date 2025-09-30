
import { Poll, PollOption, Player, Team } from '@prisma/client';

export type PollOptionWithVotes = PollOption & {
  _count: {
    votes: number;
  };
  player: (Player & { team: Team | null }) | null;
};

export type PollWithOptions = Poll & {
  options: PollOptionWithVotes[];
  match: { teamA: { name: string }, teamB: { name: string } } | null;
};
