import { PrismaClient, Player, Team, Season, Match, PlayerMatchStats, GameEvent, MatchChronicle, Poll, PollOption, Vote, Post, SeasonTeam, MatchStatus, EventType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper function to get a random element from an array
const getRandomElement = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

async function main() {
  console.log('Starting enhanced data generation...');

  const projectRoot = process.cwd();
  const prismaDir = path.join(projectRoot, 'prisma');

  // 1. Load existing data
  const teams: Team[] = JSON.parse(fs.readFileSync(path.join(prismaDir, 'respaldo', 'team.json'), 'utf-8'));
  const players: Player[] = JSON.parse(fs.readFileSync(path.join(prismaDir, 'respaldo', 'player.json'), 'utf-8'));

  // Ensure output directory exists
  const outputDir = path.join(prismaDir, 'json-exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 2. Generate Season
  const season: Season = {
    id: 1,
    name: 'Temporada 2025',
    year: 2025,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 3. Generate SeasonTeams
  const seasonTeams: SeasonTeam[] = teams.map(team => ({
    seasonId: season.id,
    teamId: team.id,
    position: 0, points: 0, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
  }));

  // 4. Generate a more extensive set of Matches (full round-robin)
  const matches: Match[] = [];
  let matchIdCounter = 1;
  const baseScheduledTime = new Date('2025-10-01T19:00:00Z');

  for (let i = 0; i < teams.length; i++) {
    for (let j = 0; j < teams.length; j++) {
      if (i === j) continue; // Teams don't play against themselves

      matches.push({
        id: matchIdCounter++,
        teamAId: teams[i].id,
        teamBId: teams[j].id,
        scheduledTime: new Date(baseScheduledTime.getTime() + (matchIdCounter * 2 * 24 * 60 * 60 * 1000)), // 2 days apart
        status: 'SCHEDULED',
        scoreA: null, scoreB: null, period: null, time: null, foulsA: null, foulsB: null, timeoutsA: null, timeoutsB: null,
        isRunning: false, activePlayersA: [], activePlayersB: [], createdAt: new Date(), updatedAt: new Date(), round: (j + 1), seasonId: season.id,
      });
    }
  }

  // 5. Initialize data containers
  const gameEvents: GameEvent[] = [];
  const playerMatchStats: PlayerMatchStats[] = [];
  const matchChronicles: MatchChronicle[] = [];
  const polls: Poll[] = [];
  const pollOptions: PollOption[] = [];
  const votes: Vote[] = [];
  let gameEventIdCounter = 1;
  let pollIdCounter = 1;
  let pollOptionIdCounter = 1;
  let voteIdCounter = 1;
  let chronicleIdCounter = 1;

  // 6. Assign varied statuses and generate detailed data
  const finishedMatchCount = Math.floor(matches.length * 0.6); // 60% finished
  const liveMatchCount = 2;
  const selectingStartersCount = 1;
  const postponedCount = 1;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const playersA = players.filter(p => p.teamId === match.teamAId);
    const playersB = players.filter(p => p.teamId === match.teamBId);

    if (i < finishedMatchCount) {
      match.status = 'FINISHED';
      match.scoreA = 0;
      match.scoreB = 0;
      match.period = 2;
      match.time = 2400;
      match.isRunning = false;

      // --- DETAILED EVENT GENERATION FOR FINISHED MATCH ---
      gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: 'MATCH_START', timestamp: 0, teamId: match.teamAId, playerId: null, playerName: null, teamName: null, playerInId: null, playerInName: null, x: null, y: null });
      gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: 'PERIOD_START', timestamp: 1, teamId: match.teamAId, playerId: null, playerName: null, teamName: null, playerInId: null, playerInName: null, x: null, y: null });

      for (let second = 0; second < 2400; second++) {
        if (Math.random() < 0.02) { // Chance of an event happening each second
          const eventTypeRoll = Math.random();
          const team = Math.random() < 0.5 ? { id: match.teamAId, players: playersA } : { id: match.teamBId, players: playersB };
          const player = getRandomElement(team.players);
          if (!player) continue;
          const teamName = teams.find(t=>t.id === team.id)!.name;

          if (eventTypeRoll < 0.4) { // SHOT
            gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: 'SHOT', timestamp: second, teamId: team.id, playerId: player.id, playerName: player.name, teamName, x: Math.random() * 100, y: Math.random() * 100, playerInId: null, playerInName: null });
          } else if (eventTypeRoll < 0.5) { // GOAL
            const scorer = player;
            gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: 'GOAL', timestamp: second, teamId: team.id, playerId: scorer.id, playerName: scorer.name, teamName, x: Math.random() * 100, y: Math.random() * 100, playerInId: null, playerInName: null });
            if (team.id === match.teamAId) match.scoreA++; else match.scoreB++;
            
            // ASSIST
            if (Math.random() < 0.6) {
              const assister = getRandomElement(team.players.filter(p => p.id !== scorer.id));
              if (assister) {
                gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: 'ASSIST', timestamp: second, teamId: team.id, playerId: assister.id, playerName: assister.name, teamName, playerInId: null, playerInName: null, x: null, y: null });
              }
            }
          } else if (eventTypeRoll < 0.7) { // FOUL
            gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: 'FOUL', timestamp: second, teamId: team.id, playerId: player.id, playerName: player.name, teamName, playerInId: null, playerInName: null, x: null, y: null });
            // CARD CHANCE
            if (Math.random() < 0.2) {
              const cardType = Math.random() < 0.1 ? 'RED_CARD' : 'YELLOW_CARD';
              gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: cardType, timestamp: second, teamId: team.id, playerId: player.id, playerName: player.name, teamName, playerInId: null, playerInName: null, x: null, y: null });
            }
          } else if (eventTypeRoll < 0.8) { // SUBSTITUTION
             const playerOut = getRandomElement(team.players);
             const playerIn = getRandomElement(players.filter(p => p.teamId === team.id && p.id !== playerOut?.id));
             if (playerOut && playerIn) {
                gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: 'SUBSTITUTION', timestamp: second, teamId: team.id, playerId: playerOut.id, playerName: playerOut.name, teamName, playerInId: playerIn.id, playerInName: playerIn.name, x: null, y: null });
             }
          } else { // TIMEOUT
            if (second > 300 && second < 2100) { // Avoid timeouts at very start/end
                gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: 'TIMEOUT', timestamp: second, teamId: team.id, playerId: null, playerName: null, teamName, playerInId: null, playerInName: null, x: null, y: null });
            }
          }
        }
      }
      gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: 'PERIOD_START', timestamp: 1200, teamId: match.teamAId, playerId: null, playerName: null, teamName: null, playerInId: null, playerInName: null, x: null, y: null });
      gameEvents.push({ id: gameEventIdCounter++, matchId: match.id, type: 'MATCH_END', timestamp: 2400, teamId: match.teamAId, playerId: null, playerName: null, teamName: null, playerInId: null, playerInName: null, x: null, y: null });
      
      [...playersA, ...playersB].forEach(p => playerMatchStats.push({ matchId: match.id, playerId: p.id, timePlayedInSeconds: Math.floor(Math.random() * 1800) + 600 }));
      matchChronicles.push({ id: chronicleIdCounter++, matchId: match.id, teamId: match.teamAId, chronicle: { content: `Crónica detallada del partido.` } as any, createdAt: new Date(), updatedAt: new Date() });
      const poll: Poll = { id: pollIdCounter++, question: `MVP del partido: ${teams.find(t=>t.id === match.teamAId)?.name} vs ${teams.find(t=>t.id === match.teamBId)?.name}?`, type: 'PLAYER_OF_THE_MATCH', createdAt: new Date(), expiresAt: null, matchId: match.id, playerId: null };
      polls.push(poll);
      [...playersA, ...playersB].slice(0, 4).forEach(p => {
          const pollOption = { id: pollOptionIdCounter++, text: p.name, pollId: poll.id, playerId: p.id };
          pollOptions.push(pollOption)
          for(let v=0; v<Math.floor(Math.random()*15); v++) {
            votes.push({ id: voteIdCounter++, pollId: poll.id, pollOptionId: pollOption.id, userId: `user_${voteIdCounter}`, createdAt: new Date() });
          }
      });

    } else if (i < finishedMatchCount + liveMatchCount) {
      match.status = 'LIVE';
      match.isRunning = true;
      match.period = Math.random() < 0.5 ? 1 : 2;
      match.time = Math.floor(Math.random() * 1200);
      match.scoreA = Math.floor(Math.random() * 3);
      match.scoreB = Math.floor(Math.random() * 3);
    } else if (i < finishedMatchCount + liveMatchCount + selectingStartersCount) {
      match.status = 'SELECTING_STARTERS';
    } else if (i < finishedMatchCount + liveMatchCount + selectingStartersCount + postponedCount) {
        match.status = 'POSTPONED';
    }
  }

  // 7. Write to JSON files
  const allData = {
    team: teams, player: players, season: [season], seasonTeam: seasonTeams, match: matches,
    playerMatchStats, gameEvent: gameEvents, matchChronicle: matchChronicles, poll: polls, pollOption: pollOptions, vote: votes, post: [] as Post[]
  };

  for (const [key, value] of Object.entries(allData)) {
    fs.writeFileSync(path.join(outputDir, `${key}.json`), JSON.stringify(value, (k, v) => (typeof v === 'bigint' ? v.toString() : v), 2));
  }

  console.log('Enhanced data generation complete. Files are in prisma/json-exports');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});